<template>
  <div class="container">
    <div class="details">
      <!--
      <input type="text" v-model.number="rows" />
      <Controls name="user" v-model="settings.user" />
      <Controls name="system" v-model="settings.system" />
      <Controls name="container" v-model="settings.container" />
      -->
      <!--<Knob v-model="n_frames" :min="1" :max="340" />-->
        <VueShowdown
          :markdown="context" />
    </div>
    <div class="graph">
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
            <g class="links" v-for="(link, index) in links">
              <line
                    :x1="getNode(link.source, nodes).x+(getNode(link.source, nodes).width/2)"
                    :y1="getNode(link.source, nodes).y+(getNode(link.source, nodes).height/2)"
                    :x2="getNode(link.target, nodes).x+(getNode(link.target, nodes).width/2)"
                    :y2="getNode(link.target, nodes).y+(getNode(link.target, nodes).height/2)"
                    stroke="black"
                    stroke-width="2px"></line>
              <!--<text
                :x="calculateHalfpoint(link.source, link.target)[0]"
                :y="calculateHalfpoint(link.source, link.target)[1]">{{ link.verb }}</text>-->
              <!--<text
                :x="calculateHalfpoint(getNode(link.source, nodes), getNode(link.target, nodes))[0]"
                :y="calculateHalfpoint(getNode(link.source, nodes), getNode(link.target, nodes))[1]">
                  {{ link.verb }}
              </text>-->
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
            <g v-if="testing" class="test-nodes" :transform="'translate('+node.x+','+node.y+')'" v-for="(node, index) in testNodes">
              <rect x="0"
                    y="0"
                    :width="node.width"
                    :height="node.height"
                    :fill="node.fill" />
            </g>
            <g class="nodes" :transform="'translate('+node.x+','+node.y+')'" v-for="(node, index) in nodes" v-bind:key="node.name">
              <Node @focus-change="clicked" :node="node" :color="color(node.type)" />
              <!--<circle
                  fill="none"
                  stroke="black"
                  :cx="(node.width/2)"
                  :cy="(node.height/2)"
                  :r="(Math.sqrt((node.width/2)**2 + (node.height/2)**2))"></circle>-->
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
    testing: {
      type: Boolean,
      default: false
    }
  })

  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

  import Node from '@/components/d3/Node.vue'
  import Controls from '@/components/d3/Controls.vue'
  import * as R from 'ramda'
  import * as d3 from 'd3'

  import Knob from 'primevue/knob'

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
  const channelGetter = ref(getChannel())
  const settings = ref({
    user: {
      x: {
        size: 280,
        padding: 70,
        offset: 20,
        position: 0,
        bound: R.gt(R.__, 600),
        fixed: 600,
      },
      y: {
        size: 170,
        padding: 0,
        offset: 20,
        position: 0,
        bound: R.gt(R.__, 200),
        fixed: 200,
      }
    },
    system: {
      x: {
        size: 280,
        padding: 0,
        offset: 30,
        position: 800,
        bound: R.lt(R.__, 1200),
        fixed: 1200,
      },
      y: {
        size: 200,
        padding: 120,
        offset: 300,
        position: 600,
        bound: R.lt(R.__, 600),
        fixed: 600,
      }
    },
    container: {
      x: {
        size: 300,
        padding: 130,
        offset: 60,
        position: 50,
        bound: R.gt(R.__, 750),
        fixed: 750,
      },
      y: {
        size: 200,
        padding: 160,
        offset: 280,
        position: 800,
        bound: R.lt(R.__, 600),
        fixed: 600,
      }
    }
  })
  const rows              = ref(4)
  const links = ref([])
  const n_frames = ref(1)
  const nodes = ref([])

  const resizeObserver = new ResizeObserver(() => {
    updateSimulation()
  })

  const say = R.tap((x) => console.log(x))
  const nodesByName = R.pluck('name')

  onMounted(() => {
    resizeObserver.observe(d3Svg.value)
    svg = d3.select(d3Svg.value)
    zoom = d3.zoom()
        .scaleExtent([0.1, 32])
        .on('zoom', e => {
          channelGetter.value = getChannel()
          gTransform.value = e.transform
        })
    svg.call(zoom)
    const _width = d3Svg.value.width.baseVal.value
    const _height = d3Svg.value.height.baseVal.value
    /*const centered = d3.zoomIdentity
        .scale(_width/graphicWidth);
    svg.call(zoom.transform, centered);*/
    calcLinks()
    watch(data, calcLinks)
    watch(n_frames, getSimulation)
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
        return {x: 0, y: 0, width: 1, height: 1}
      }
    }
  }

  function calcLinks() {
    var _data_links = []
    _data_links = R.filter(R.compose(
        R.isNotEmpty,
        R.intersection(nodesByName(nodes.value)),
        R.props(['source', 'target'])
      ), props.payload.links)
    _data_links = R.map(({target, source, ...rest}) => {
      const targetNode = getNode(target, data.value.nodes),
            sourceNode = getNode(source, data.value.nodes),
            xDiff = Math.abs(targetNode.x, sourceNode.x),
            yDiff = Math.abs(targetNode.y, sourceNode.y),
            horizontal = xDiff < yDiff
      return {
        ...rest,
        horizontal: horizontal,
        target: R.prop('name', getNode(target, data.value.nodes)),
        source: R.prop('name', getNode(source, data.value.nodes)),
      }
    }, _data_links)
    links.value = _data_links
    //getSimulation()
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
    console.log("getSimulation() called")
    if (data !== {}) {
      const _width = d3Svg.value.width.baseVal.value
      const _height = d3Svg.value.height.baseVal.value
      nodes.value = data.value.nodes.map(d => R.clone(d))
      const simulation = d3.forceSimulation(nodes.value)
        //.force("many-body", d3.forceManyBody().strength(-100))
        //.force("link", d3.forceLink(links.value).id(d => getNode(d.name, nodes.value).name).strength(0.8).distance(200).iterations(30))
        .force("vertical-sort", d3.forceY(R.pipe(
            R.prop('type'),
            R.cond([
              [R.equals('user'), R.always(200)],
              [R.equals('system'), R.always(1200)],
              [R.equals('container'), R.always(1200)],
              [R.T, R.always(0)]
            ])
          )).strength(1)
        )
        .force("horizontal-sort", d3.forceX(R.pipe(
            R.prop('type'),
            R.cond([
              [R.equals('user'), R.always(200)],
              [R.equals('system'), R.always(1200)],
              [R.equals('container'), R.always(400)],
              [R.T, R.always(0)]
            ])
          )).strength(1)
        )
        /*
        .force("custom-bounding", () => {
          R.forEach(node => {
            if (settings.value[node.type].x.bound(node.x)) {
              node.x = settings.value[node.type].x.fixed
            }
            if (settings.value[node.type].y.bound(node.y)) {
              node.y = settings.value[node.type].y.fixed
            }
          }, nodes.value)
        })
        */
        .force("collide", d3.forceCollide((d) => (Math.sqrt((d.width/2)**2 + (d.height/2)**2))).strength(0.6))
        .stop()
        .tick(1200)
      /*
      let posTools = {}
      posTools["user"] = getPos("user")
      posTools["system"] = getPos("system")
      posTools["container"] = getPos("container")
      nodes.value = R.map(({x, y, type, ...rest}) => {
        const pos = posTools[type].next().value
        return {
          ...rest,
          "type": type,
          "x": pos[0],
          "y": pos[1]
        }
      }, nodes.value)
      */
      calcLinks()
      const everything = d3.select(d3Svg.value).select(".everything")
      const centered = d3.zoomIdentity
          .translate(0, 0)
          .scale(_width/graphicWidth);
      svg.transition().duration(600).call(
        zoom.transform, centered
      )
    }
  }

  function clicked(name, newScope) {
    selected.value = name
    scope.value = newScope
    simulation.value = getSimulation()
  }

  function calculateHalfpoint(source, target) {
    const x1 = source.x, y1 = source.y,
          x2 = target.x, y2 = target.y,
          shift =
          middleX = (x1 + x2 + parseInt(x1 <= x2 ? source.width : target.width)) / 4,
          middleY = (y1 + y2 + parseInt(y1 <= y2 ? source.height : target.height)) / 4
    return [middleX, middleY]
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
    const { compose, pluck, filter, reject, map, includes } = R
    let _data = {}

    const inScope = R.includes(R.__, scopesUsed.value)
    const isIncluded = R.filter(R.isNotEmpty(selected.value) ? R.pipe(R.propEq(selected.value, 'parent')) : R.pipe(R.prop('type'), inScope))

    // Fix this later I guess
    const inScope2 = filter(compose(
      includes(R.__, scopesUsed.value),
      R.prop('type'),
    ))
    const outScope = reject(compose(
      includes(R.__, scopesUsed.value),
      R.prop('type'),
    ))

    const pickSelected = R.filter((R.isNotEmpty(selected.value)) ? R.propEq(selected.value, 'parent') : R.T)
    const newFiltered = R.into([], R.compose(pickSelected, inScope2), props.payload.nodes)

    const refineNodes = (nodes, links, selected) => {
      const linkRelevant = R.curry((links, {name}) =>
        R.filter(R.anyPass(R.map(R.propEq(name))(['target', 'source'])), links)
      )
      const linkTargets = R.chain(R.props(['source', 'target']))
      const isTargeted = R.curry((nodes, targets) => R.filter(R.compose(
          includes(R.__, targets),
          R.prop('name'),
        ), nodes))
      const pickSelected = R.filter((R.isNotEmpty(selected)) ? R.propEq(selected, 'parent') : R.T)
      const newFiltered = inScope2(nodes)
      const linksFiltered = R.chain(linkRelevant(links))
      const removeFiltering = R.into([], R.compose(
          inScope2,
          R.lift(say)(R.pipe(pickSelected, linksFiltered, linkTargets, R.uniq)),
        ), nodes)
      console.log(removeFiltering)
      //const selectedNodes = R.converge(isTargeted, [R.identity, R.pipe(pickSelected, linksFiltered, linkTargets, R.uniq)])(newFiltered)
          //pickSelected,
          //linksFiltered,
          //linkTargets,
          //R.uniq,
          //isTargeted(newFiltered),
        //), newFiltered)
      //console.log(selectedNodes)


      //console.log(newFiltered)
      /*console.log(R.into([], R.compose(
        R.compose(
          inscope2,
          pickSelected),
        R.converge(isTargeted, [R.identity, linkTargets(R.chain(linkReleveant(links)))])
      ), nodes)*/

      //console.log(newFiltered)
      //console.log(linksFiltered)
      //console.log(linkTargets(linksFiltered))
      //console.log(isTargeted(newFiltered, linkTargets(linksFiltered)))
    }

    var _data_links = []

    //refineNodes(props.payload.nodes, props.payload.links, selected.value)
    if (props.payload !== {}) {
      _data.nodes = isIncluded(props.payload.nodes)
      if (selected.value) {
        const selected_nodes = isIncluded(props.payload.nodes)
        //const selected_nodes = R.filter(R.propEq(selected.value, 'parent'), props.payload.nodes)
        _data_links = R.filter(R.compose(
            R.isNotEmpty,
            R.intersection(nodesByName(selected_nodes)),
            R.props(['source', 'target'])
          ), props.payload.links)
        const linked_nodes = R.map( x => R.flatten(R.filter(y => R.includes(R.prop('name', y), [x.target, x.source]), props.payload.nodes)), _data_links)
        _data.nodes = R.uniq(R.concat(selected_nodes, R.flatten(linked_nodes)))
        _data.nodes = R.filter(x => R.includes(R.prop('type', x), scopesUsed.value), _data.nodes)
      } else {
        _data_links = R.filter(R.compose(
            R.isNotEmpty,
            R.intersection(nodesByName(_data.nodes)),
            R.props(['source', 'target'])
          ), props.payload.links)
      }
    }
    _data_links = R.map(({target, source, ...rest}) => {
      return {...rest, "target": R.prop('name', getNode(target, _data.nodes)), "source": R.prop('name', getNode(source, _data.nodes))}
    }, _data_links)
    _data.nodes = R.map(({name, type, ...rest}) => {
      return {
        ...rest,
        type: type,
        name: name,
        children: R.pipe(R.filter(R.propEq(name, "parent")), R.pluck("name"))(props.payload.nodes),
        width: settings.value[type].x.size,
        height: settings.value[type].y.size,
        x: settings.value[type].x.position,
        y: settings.value[type].y.position,
      }
    }, _data.nodes)
    channelGetter.value = getChannel()
    return _data
  })

  function getChannel() {
    var objsUsed = {}
    var returningX = true
    const fauxIterator = {
      getNext(node, isHorizontal = true) {
        console.log("GetNext called")
        console.log(`Node: ${node.name}-${node.type}: [${node.x}, ${node.y}]`)
        if (objsUsed[node.name] == null) {
          objsUsed[node.name] = {x: 0, y: 0}
        }
        if (!isHorizontal) {
          if(returningX) {
            returningX = !returningX
            console.log(`Returning horizontal x value: ${node.x}`)
            return node.x;
          } else {
            returningX = !returningX
            objsUsed[node.name].y += 1
            console.log(`Returning horizontal y value: ${node.y + objsUsed[node.name].y * (settings.value[node.type].y.size / 8)}`)
            return node.y + objsUsed[node.name].y * (settings.value[node.type].y.size / 8)
          }
        } else {
          if(returningX) {
            returningX = !returningX
            objsUsed[node.name].x += 1
            console.log(`Returning vertical x value: ${node.x + objsUsed[node.name].x * (settings.value[node.type].x.size / 8)}`)
            return node.x + objsUsed[node.name].x * (settings.value[node.type].x.size / 8)
          } else {
            returningX = !returningX
            console.log(`Returning vertical y value: ${node.y}`)
            return node.y;
          }
        }
      }
    }
    return fauxIterator
  }

  function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }
</script>

<style scoped>
  :deep(svg div) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  :deep(svg h4), :deep(svg p) {
    padding: 0;
    margin: 0;
  }

  :deep(.interactable) {
    cursor: pointer;
  }

  :deep(.plain) {
    cursor: default;
  }

  .container {
    display: flex;
  }

  .details {
    flex: 1 0 0;
  }

  .graph {
    flex: 5 0 0;
  }

  .svg-container {
    aspect-ratio: 4/3;
    max-height: 80vh;
  }
</style>
