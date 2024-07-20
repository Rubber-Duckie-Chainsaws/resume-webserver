<template>
  <div class="d-flex">
    <aside>
      <h1>Themerator</h1>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Purpose</th>
            <th scope="col">Swatch</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Primary</td>
            <td>The color of the main text</td>
            <td>
              <div class="p-3 rounded-2" style="background-color: var(--bs-body-color); border: 1px solid black;" @click="toggle">&nbsp;</div>
              <Popover ref="test">
                <div class="bg-light">
                  <ColorPicker v-model="theme['--bs-body-color']" @change="updateColours" inline />
                  <!--<input type="color" class="form-control form-control-color" @change="updateColours" v-model="theme['--bs-body-color']" ref="bs-body-color-select">-->
                </div>
              </popover>
            </td>
          </tr>
          <tr>
            <td>Background</td>
            <td>The color of the background text</td>
            <td><div class="p-3 rounded-2" style="background-color: var(--bs-body-bg); border: 1px solid black;">&nbsp;</div></td>
          </tr>
        </tbody>
      </table>
    </aside>
    <main>
      <nav class="navbar navbar-expand-md secondary-bg">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Brand link</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTestSupportedContent" aria-controls="navbarTestSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarTestSupportedContent">
            <ul class="navbar-nav">
              <li class="nav-item"><a class="nav-link" href="#">Test link 1</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Test link 2</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Test link 3</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Test link 4</a></li>
            </ul>
          </div>
        </div>
      </nav>
      <h1>Sample webpage</h1>
      <div class="row">
        <div class="col-8">
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
        <div class="col">
          <h3>Sidebar content</h3>
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-success">Success</button>
          <button class="btn btn-danger">Danger</button>
          <button class="btn btn-warning">Warning</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Popover from 'primevue/popover'
import ColorPicker from 'primevue/colorpicker'
import { ref, onMounted, watch } from 'vue'
import * as R from 'ramda'

const test = ref()

const theme = ref({
  '--bs-body-color': 'ffffff',
  '--bs-body-bg': '008000',
  '--bs-dark': 'ffc107',
  '--bs-primary': '0d6efd',
  '--bs-secondary': '6c757d',
  '--bs-danger': 'dc3545',
  '--bs-warning': 'ffc107',
  '--bs-secondary-color': 'ffc107',
  '--bs-secondary-bg': 'ffc107',
  '--bs-tertiary-color': 'ffc107',
  '--bs-tertiary-bg': 'ffc107',
  '--bs-emphasis-color': 'ffc107',
  '--bs-border-color': 'dc3545',
  '--background-color': '242424',
})
const changing = ref("--bs-body-color")

function updateColours() {
  console.log("updateColours called")
  for (const [key, value] of Object.entries(theme.value)) {
    document.documentElement.style.setProperty(key, "#"+value)
    document.documentElement.style.setProperty(key+'-rgb', hexToRgb(value))
  }
}

function hexToRgb(hex) {
  //hex = hex.slice(1) //trim the #
  return R.map(x => parseInt(x, 16), R.splitEvery(2, hex))
}

function rgbToHex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
}

function toggle(event) {
  test.value.toggle(event)
}

onMounted(() => {
  updateColours()
})
</script>

<style scoped>

</style>
