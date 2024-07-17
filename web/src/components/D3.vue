<template>
  <div class="row">
    <div class="col">
      <!--
      <input type="text" v-model.number="rows" />
      <Controls name="user" v-model="settings.user" />
      <Controls name="system" v-model="settings.system" />
      <Controls name="container" v-model="settings.container" />
      -->
        <VueShowdown
          :markdown="context" />
    </div>
    <div class="col-9">
      <div class="svg-container">
        <svg xmlns="http://www.w3.org/2000/svg"
             ref="d3Svg"
             height="100%"
             width="100%"
             style="border: 1px solid black;">
          <g class="ui"
             v-if="selected !== ''"
             :transform="'translate('+(d3Svg.width.baseVal.value - 300)+', 10)'">
            <foreignObject x="0" y="0" width="300px" height="300px">
              <a href="#" @click="clicked('', 'system')" style="color: white;">Reset</a>
            </foreignObject>
          </g>
          <g class="everything"
             :transform="gTransform.toString()">
            <g class="links">
              <line v-for="(link, index) in data.links"
                    :x1="getNode(link.source).x+(getNode(link.source).width/2)"
                    :y1="getNode(link.source).y+(getNode(link.source).height/2)"
                    :x2="getNode(link.target).x+(getNode(link.target).width/2)"
                    :y2="getNode(link.target).y+(getNode(link.target).height/2)"
                    stroke="black"
                    stroke-width="2px"></line>
            </g>
            <g class="focus-bounds" v-if="scope !== 'system'">
            <rect x="10"
                  y="160"
                  fill="none"
                  stroke="black"
                  stroke-width="2px"
                  :width="(d3Svg.width.baseVal.value - 270)"
                  :height="(d3Svg.height.baseVal.value - 180)" />
            </g>
            <!--
            <g class="test-nodes" :transform="'translate('+node.x+','+node.y+')'" v-for="(node, index) in testNodes">
              <rect x="0"
                    y="0"
                    :width="node.width"
                    :height="node.height"
                    :fill="node.fill" />
            </g>
            -->
            <g class="nodes" :transform="'translate('+node.x+','+node.y+')'" v-for="(node, index) in data.nodes" v-bind:key="node.name">
              <component @focus-change="clicked" :is="getType(node.type)" :node="node" :color="color(node.type)" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    "payload": Object,
  })

  import { ref, computed, onMounted, onUnmounted } from 'vue'

  import User from '@/components/d3/User.vue'
  import System from '@/components/d3/System.vue'
  import Container from '@/components/d3/Container.vue'
  import Controls from '@/components/d3/Controls.vue'
  import * as R from 'ramda'
  import * as d3 from 'd3'

  const d3Svg = ref(null)
  const gTransform = ref("translate(0, 0) scale(1)")
  const scope = ref("system")
  const coords = ref({x: 0, y: 0})
  const graphicWidth = 2000
  const graphicHeight = 1500
  const selected = ref("")
  const color = d3.scaleOrdinal(d3.schemeTableau10).domain(["system", "service", "container", "user"])
  const simulation = ref(null)
  let svg = null
  let zoom = null
  const updateSimulation = debounce(() => getSimulation(), 500)
  const settings = ref({
    user: {
      x: {
        size: 280,
        padding: 70,
        offset: 20,
      },
      y: {
        size: 170,
        padding: 0,
        offset: 20,
      }
    },
    system: {
      x: {
        size: 280,
        padding: 0,
        offset: 30,
      },
      y: {
        size: 200,
        padding: 120,
        offset: 300,
      }
    },
    container: {
      x: {
        size: 300,
        padding: 130,
        offset: 60,
      },
      y: {
        size: 200,
        padding: 160,
        offset: 280,
      }
    }
  })
  const rows              = ref(4)

  const resizeObserver = new ResizeObserver(() => {
    updateSimulation()
  })

  onMounted(() => {
    resizeObserver.observe(d3Svg.value)
    svg = d3.select(d3Svg.value)
    zoom = d3.zoom()
        .scaleExtent([0.1, 32])
        .on('zoom', e => {
          gTransform.value = e.transform
        })
    svg.call(zoom)
    const _width = d3Svg.value.width.baseVal.value
    const _height = d3Svg.value.height.baseVal.value
    const centered = d3.zoomIdentity
        .scale(_width/graphicWidth);
    svg.call(zoom.transform, centered);
    simulation.value = getSimulation()
  })

  onUnmounted(() => {
    resizeObserver.disconnect()
  })

  function debounce(fn, delay) {
    let timeout = null
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        fn()
      }, delay || 500);
    }
  }

  function getNode(name, nodes) {
    if (!nodes) {
      nodes = data.value.nodes
    }
    let node = R.find(R.propEq(name, 'name'), nodes)
    if (node) {
      return node
    } else {
      node = R.find(R.propEq(name, 'name'), props.payload.nodes)
      let parentNode = R.find(R.propEq(node.parent, 'name'), nodes)
      if (parentNode) {
        return parentNode
      } else {
        return null
      }
    }
  }

  function* getPos(type) {
    function* inc(start, size) {
      let current = start
      while (true) {
        let restart = yield current
        if (restart) {
          current = start
        } else {
          current += size
        }
      }
    }
    function* keep(start) {
      while (true) {
        yield start
      }
    }
    function* incHandler(primary, secondary, maxVal, yFirst = false) {
      let value1 = primary.next().value
      let value2 = secondary.next().value
      while (true) {
        if (yFirst) {
          yield [value2, value1]
        } else {
          yield [value1, value2]
        }
        if (value1 >= maxVal) {
          value2 = secondary.next().value
        }
        value1 = primary.next(value1 >= maxVal).value
      }
    }
    let handler = null
    switch (type) {
      case "user":
        handler = incHandler(inc(settings.value.user.x.offset, (settings.value.user.x.size + settings.value.user.x.padding)), keep(settings.value.user.y.offset), Infinity)
        break;
      case "system":
        if (scope.value == "system") {
          handler = incHandler(inc(settings.value.container.x.offset, (settings.value.container.x.size + settings.value.container.x.padding)), inc(settings.value.container.y.offset, (settings.value.container.y.size + settings.value.container.y.padding)), ((settings.value.container.x.size + settings.value.container.x.padding) * (rows.value - 1)))
        } else if (scope.value == "container") {
          handler = incHandler(inc(settings.value.system.y.offset, (settings.value.system.y.size + settings.value.system.y.padding)), keep(graphicWidth - (settings.value.system.x.size + settings.value.system.x.offset)), Infinity, true)
        }
        break;
      case "container":
        handler = incHandler(inc(settings.value.container.x.offset, (settings.value.container.x.size + settings.value.container.x.padding)), inc(settings.value.container.y.offset, (settings.value.container.y.size + settings.value.container.y.padding)), ((settings.value.container.x.size + settings.value.container.x.padding) * (rows.value - 1)))
        break;
    }
    while (true) {
      let vals = handler.next().value
      yield vals
    }
  }

  function getSimulation() {
    if (data !== {}) {
      const _width = d3Svg.value.width.baseVal.value
      const _height = d3Svg.value.height.baseVal.value
      let posTools = {}
      posTools["user"] = getPos("user")
      posTools["system"] = getPos("system")
      posTools["container"] = getPos("container")
      data.value.nodes = R.map(({x, y, type, ...rest}) => {
        const pos = posTools[type].next().value
        return {
          ...rest,
          "type": type,
          "x": pos[0],
          "y": pos[1]
        }
      }, data.value.nodes)
      const everything = d3.select(d3Svg.value).select(".everything")
      const centered = d3.zoomIdentity
          .translate(0, 0)
          .scale(_width/graphicWidth);
      svg.transition().duration(600).call(
        zoom.transform, centered
      )
      //const _simulation = d3.forceSimulation(data.value.nodes)
      //    .force("x0", d3.forceX())
      //    .force("y0", d3.forceY())
      //    .force("x", d3.forceX(_width).strength(d => {
      //      switch(d.type) {
      //        case "user":
      //          return 0.01
      //          break
      //        case "system":
      //          return 0.01
      //          break;
      //        case "container":
      //          return 0.05
      //          break;
      //        case "component":
      //          return 0.08
      //        default:
      //          return 0.03
      //      }
      //    }))
      //    .force("y", d3.forceY(_height).strength(d => {
      //      switch(d.type) {
      //        case "user":
      //          return 0.01
      //          break
      //        case "system":
      //          return 0.09
      //          break;
      //        case "container":
      //          return 0.05
      //          break;
      //        case "component":
      //          return 0.08
      //        default:
      //          return 0.03
      //      }
      //    }))
      //    .force("manyBody", d3.forceManyBody().strength(-3500))
      //    // This doesn't work, bigly, and I'm not sure why :(
      //    //.force("links", d3.forceLink(data.value.links).id(d => d.name).strength(-2).distance(20).iterations(10))
      //    .force("collide", d3.forceCollide(150))
      //    .on("end", () => {
      //      loaded.value = true
      //    })
        //return _simulation
      }
  }

  function clicked(name, newScope) {
    selected.value = name
    scope.value = newScope
    simulation.value = getSimulation()
  }

  function getType(type) {
    switch(type) {
      case "user":
        return User
        break;
      case "system":
        return System
        break;
      case "container":
        return Container
        break;
    }
  }

  const testNodes = computed(() => {
      let posTools = {}
      posTools["user"] = getPos("user")
      posTools["system"] = getPos("system")
      posTools["container"] = getPos("container")
      const _color = d3.scaleOrdinal(d3.schemePastel1).domain(["system", "service", "container", "user"])
      return R.map(({type}) => {
        const pos = posTools[type].next().value
        return {
          'type': type,
          'width': settings.value[type].x.size,
          'height': settings.value[type].y.size,
          'fill': _color(type),
          'x': pos[0],
          'y': pos[1]
        }
      }, R.unfold(
        R.cond([
          [(x) => x <= 4, (n) => [{type: "user"}, n+1]],
          [(x) => x <= 7, (n) => [{type: "system"}, n+1]],
          [(x) => x <= 19, (n) => [{type: "container"}, n+1]],
          [R.T, R.always(false)]
        ]),
        0
      ))
  })

  const scopesUsed = computed(() => {
    switch(scope.value) {
      case "system":
        return ["user", "system"]
        break;
      case "container":
        return ["user", "container", "system"]
        break;
      case "component":
        return ["component", "container", "system"]
        break;
    }
  })

  const context = computed(() => {
    if (selected.value !== "") {
      return R.prop('context', R.find(R.propEq(selected.value, 'name'), props.payload.nodes))
    } else {
      return props.payload.context
    }
  })

  const data = computed(() => {
    let _data = {}
    if (props.payload !== {}) {
      if (selected.value) {
        const selected_nodes = R.filter(R.propEq(selected.value, 'parent'), props.payload.nodes)
        _data.links = R.filter(
          x => R.or(
            R.includes(R.prop('source', x), R.map(R.prop('name'), selected_nodes)),
            R.includes(R.prop('target', x), R.map(R.prop('name'), selected_nodes))
          ), props.payload.links)
        const linked_nodes = R.map( x => R.flatten(R.filter(y => R.includes(R.prop('name', y), [x.target, x.source]), props.payload.nodes)), _data.links)
        _data.nodes = R.uniq(R.concat(selected_nodes, R.flatten(linked_nodes)))
        _data.nodes = R.filter(x => R.includes(R.prop('type', x), scopesUsed.value), _data.nodes)
      } else {
        _data.nodes = R.filter(x => R.includes(R.prop('type', x), scopesUsed.value), props.payload.nodes)
        _data.links = R.filter(
          x => R.or(
            R.includes(R.prop('source', x), R.map(R.prop('name'), _data.nodes)),
            R.includes(R.prop('target', x), R.map(R.prop('name'), _data.nodes))
          ), props.payload.links)
      }
    }
    _data.links = R.map(({target, source, ...rest}) => {
      return {...rest, "target": R.prop('name', getNode(target, _data.nodes)), "source": R.prop('name', getNode(source, _data.nodes))}
    }, _data.links)
    _data.nodes = R.map(({name, ...rest}) => {
      return {...rest, "name": name, children: R.pipe(R.filter(R.propEq(name, "parent")), R.pluck("name"))(props.payload.nodes)}
    }, _data.nodes)
    return _data
  })
</script>

<style scoped>
.svg-container {
  aspect-ratio: 4/3;
  max-height: 80vh;
}
</style>
