<template>
  <div class="themer-grid">
    <aside class="themer col">
      <button
          class="hamburger-toggle themerator-toggle"
          style="width: 100px;"
          aria-expanded="false"
          @click="toggleThemer"
          ref="themerToggle">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <div class="themer-popover">
        <ColorTool />
      </div>
    </aside>
    <main class="col-2 themed">
      <Header :links="testLinks">
        <template #brand>
          <a class="navbar-brand" href="#">Brand link</a>
        </template>
      </Header>
      <h1>Sample webpage</h1>
      <div class="content-grid">
        <div class="">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus iaculis risus non porta. Vestibulum faucibus lorem leo, eget euismod enim varius id. Nulla ultrices sapien non mattis placerat. Sed tincidunt turpis quis purus imperdiet, at scelerisque metus lacinia. Donec volutpat in orci id pellentesque. Etiam vestibulum lectus vel semper accumsan. Cras nibh metus, ultrices vel mollis nec, vulputate ut orci. Integer ut fringilla lorem. Maecenas aliquam, ligula sed volutpat hendrerit, libero sem aliquam justo, nec vulputate risus diam ac nisi. Ut eu diam mi.
          </p>
          <p>
            Suspendisse potenti. Curabitur vehicula, sapien in accumsan rutrum, urna odio malesuada augue, a vestibulum dui est non neque. Sed non mollis est. Integer laoreet cursus felis, a bibendum urna ultrices at. Phasellus congue, quam sed luctus tincidunt, nisl orci egestas libero, nec pretium purus tellus a urna. Ut dolor ex, ultricies at sollicitudin ut, sollicitudin id sapien. Cras nisi leo, efficitur ac odio sit amet, sodales placerat dui. In aliquam tortor auctor erat elementum, suscipit dignissim nisi elementum. Nulla vulputate nec urna a pretium. Cras ut pulvinar massa.
          </p>
          <p>
            Praesent sem nisi, fermentum ac ipsum quis, egestas lacinia mauris. Fusce mauris orci, convallis fermentum leo sollicitudin, elementum porta lectus. Nulla a scelerisque ligula, ac tristique quam. Nullam dignissim porta magna eu hendrerit. Aenean sit amet volutpat ligula, in convallis turpis. Vestibulum vel orci mi. Donec aliquam finibus ipsum eget fermentum. Quisque sit amet ipsum sit amet elit semper hendrerit nec vel turpis. Nullam finibus, nisi sit amet semper lacinia, risus ipsum laoreet diam, in pharetra lectus mi quis neque. Suspendisse bibendum mi libero, sit amet molestie lectus tempor id. Phasellus sodales vel lorem non imperdiet. Fusce dignissim hendrerit odio, eget vestibulum mi feugiat ut.
          </p>
          <p>
            Praesent arcu tortor, lobortis nec magna at, luctus rhoncus orci. Vivamus a ipsum gravida est faucibus aliquet a et sem. Curabitur interdum quam eget finibus sollicitudin. Phasellus sed elementum ipsum. Etiam maximus leo pretium, ullamcorper velit id, porttitor purus. Mauris dictum, sem quis feugiat faucibus, metus urna blandit orci, a pellentesque nunc lacus et nibh. Aenean venenatis porttitor enim, non auctor magna semper non. Maecenas elementum lorem fermentum tortor consequat, ac congue sem feugiat. Sed congue quam sapien, at suscipit sapien pretium in. Sed pharetra erat eget arcu porttitor consequat. Integer fringilla ante massa, eget cursus risus dignissim quis. Etiam posuere lacus turpis, ut mattis mauris elementum non. Morbi ut molestie arcu. In aliquet erat a lectus vestibulum, id ornare sapien tincidunt. Cras imperdiet nec felis vitae condimentum.
          </p>
          <p>
            In sem mi, ultricies nec metus pretium, interdum facilisis ex. Quisque in efficitur tortor, sed pellentesque sapien. Cras vel vulputate sapien. Etiam in dui turpis. Morbi sed tempor massa. Nam bibendum, risus eu volutpat vulputate, nulla urna vestibulum felis, ut ultrices nisi ante id est. Nulla facilisi. Praesent at rhoncus dolor, ut tempor velit. Vestibulum lacus velit, elementum vel faucibus rutrum, commodo hendrerit tellus. In accumsan, magna sed feugiat consequat, odio enim tincidunt orci, vel sollicitudin metus felis eget mi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin cursus ornare mauris, nec commodo felis ultrices sit amet. Sed cursus eleifend lorem, eu tincidunt odio mattis et. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
          </p>
        </div>
        <div class="sidebar">
          <h3>Sidebar content</h3>
          <div class="button-group">
            <button class="btn btn-primary">Primary</button>
            <button class="btn btn-success">Success</button>
            <button class="btn btn-danger">Danger</button>
            <button class="btn btn-warning">Warning</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import Popover from 'primevue/popover'
  import ColorTool from '@/components/themer/ColorTool.vue'
  import Header from '@/components/Header.vue'
  import { ref, onMounted, watch } from 'vue'
  import * as R from 'ramda'

  const themerToggle = ref()
  const primary = ref()
  const background = ref()
  const tableHovering = ref(false)
  const testLinks = [
    {
      name: "Test link 1",
      route: "/themer"
    },
    {
      name: "Test link 2",
      route: "/themer"
    },
    {
      name: "Test link 3",
      route: "/themer"
    },
    {
      name: "Test link 4",
      route: "/themer"
    },
  ]

  const newTheme = ref([
    {
      name: 'Text',
      description: 'The color of the main text',
      colorValue: '000000',
      varName: '--body-color'
    },
    {
      name: 'Background',
      description: 'The color of the background',
      colorValue: 'e5fff9',
      varName: '--background-color'
    },
    {
      name: 'Secondary',
      description: 'For things that should pop out',
      colorValue: '000000',
      varName: '--secondary-color'
    },
    {
      name: 'Secondary Background',
      description: 'For areas that should pop out',
      colorValue: '000000',
      varName: '--secondary-background'
    },
    {
      name: 'Accent',
      description: 'For things that need to be set apart',
      colorValue: '000000',
      varName: '--accent-color'
    },
    {
      name: 'Accent Background',
      description: 'For areas that need a bit of contrast',
      colorValue: '000000',
      varName: '--accent-background'
    },
    {
      name: 'Primary',
      description: 'Primary interaction color',
      colorValue: '005eff',
      varName: '--primary-color'
    },
    {
      name: 'Success',
      description: 'Used to signify positive result',
      colorValue: '00850d',
      varName: '--success-color'
    },
    {
      name: 'Warning',
      description: 'Used to signify attention needed',
      colorValue: 'ffd000',
      varName: '--warning-color'
    },
    {
      name: 'Danger',
      description: 'Used to signify a negative result',
      colorValue: 'c70000',
      varName: '--danger-color'
    },
  ])

  function colorChosen(name, colorValue) {
    const idx = R.findIndex(R.propEq(name, 'name'))(newTheme.value)
    newTheme.value[idx].colorValue = colorValue.slice(1)
  }

  function updateColours() {
    for (var i = 0; i < newTheme.value.length; i++) {
      const value = newTheme.value[i]
      document.documentElement.style.setProperty(value.varName, "#"+value.colorValue)
      document.documentElement.style.setProperty(value.varName+'-rgb', hexToRgb(value.colorValue))
    }
  }

  function hexToRgb(hex) {
    //hex = hex.slice(1) //trim the #
    return R.map(x => parseInt(x, 16), R.splitEvery(2, hex))
  }

  function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
  }

  function toggleThemer() {
    themerToggle.value.ariaExpanded = themerToggle.value.ariaExpanded !== "true"
  }

  function togglePrimary(event) {
    primary.value.toggle(event)
  }

  function toggleBackground(event) {
    background.value.toggle(event)
  }

  onMounted(() => {
    updateColours()
  })
</script>

<style scoped>
  .themer {
    position: relative;
  }

  .themer-popover {
    position: absolute;
    top: 60px;
    height: 90vh;
    background: white;
    visibility: hidden;
    overflow: hidden;
    transition: grid-template-rows 1200ms ease-in-out, visibility 800ms;
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-template-rows: 0fr;
  }

  .themerator-toggle[aria-expanded='true'] + .themer-popover {
    visibility: visible;
    overflow-y: scroll;
    grid-template-rows: 1fr;
  }

  .themer-grid {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-column-gap: 10px;
  }

  .content-grid {
    display: flex;
    flex-wrap: wrap;
  }

  .sidebar {
    flex: 1 0 0;
  }

  @media only screen and (min-width: 768px) {
    .content-grid {
      display: grid;
      grid-template-columns: 3fr 1fr;
      grid-column-gap: 10px;
    }
  }

  @media only screen and (min-width: 992px) {
    .themer {
      position: static;
    }
    .themerator-toggle {
      display: none;
    }
    .themer-popover {
      position: static;
      visibility: visible;
      overflow-y: scroll;
      grid-template-rows: 1fr;
    }

    .flex-container {
    }
    .sidebar .flex-container * {
      flex: 1 0 100px;
    }
  }
</style>
