import { defineStore } from 'pinia'
import { hex2rgb } from '@/composables/global.js'
import { useStorage } from '@vueuse/core'
import * as R from 'ramda'

const THEME_CONFIGS_PARTS = [
  {
    name: "primaryHeader",
    options: ["primary", "dark", "light"]
  },
  {
    name: "secondaryHeader",
    options: ["primary", "dark", "light"]
  },
  {
    name: "headerAlignment",
    options: ["left", "right"]
  }
]

const THEME_COLOR_PARTS = [
  {
    name: "Text",
    description: 'The color of the main text',
    varName: '--body-color',
  },
  {
	name: "Background",
    description: 'The color of the background',
    varName: '--background-color',
  },
  {
    name: "Callout",
    description: "Used to highlight callouts or other subsections",
    varName: "--callout-color",
  },
  {
	name: "Accent",
    description: 'For high contrast subsectiosn that need to draw the eye',
    varName: '--accent-color',
  },
  {
	name: "Primary",
    description: 'Primary interaction color',
    varName: '--primary-color',
  },
  {
	name: "Secondary",
    description: 'For things that should pop out',
    varName: '--secondary-color',
  },
  {
	name: "Success",
    description: 'Used to signify positive result',
    varName: '--success-color',
  },
  {
	name: "Warning",
    description: 'Used to signify attention needed',
    varName: '--warning-color',
  },
  {
	name: "Danger",
    description: 'Used to signify a negative result',
    varName: '--danger-color',
  },
  {
    name: "Info",
    description: "Used to signify purely informational statuses",
    varName: '--info-color',
  },
  {
    name: 'Border',
    description: 'Standard border color',
    varName: '--border-color',
  },
  {
    name: 'Dark',
    description: 'For forcing a dark layout',
    varName: '--dark-color',
  },
  {
    name: 'Light',
    description: 'For forcing a light layout',
    varName: '--light-color',
  },
]

export const useThemeStore = defineStore('theme', {
  state: () => {
    return {
      chosen: useStorage('chosenTheme', "default-theme"),
      availableThemes: ["default-theme"],
      currentTheme: {
        configs: {
          primaryHeader: "primary",
          secondaryHeader: "dark",
          headerAlignment: "left"
        },
        colors: [
          {
            name: 'Text',
            description: 'The color of the main text',
            colorValue: '000000',
            varName: '--body-color',
          },
          {
            name: 'Background',
            description: 'The color of the background',
            colorValue: 'dbf4f4',
            varName: '--background-color',
          },
          {
            name: 'Secondary',
            description: 'For things that should pop out',
            colorValue: '065b5f',
            varName: '--secondary-color',
          },
          {
            name: 'Secondary Background',
            description: 'For areas that should pop out',
            colorValue: '6d9e9e',
            varName: '--secondary-background',
          },
          {
            name: 'Accent',
            description: 'For things that need to be set apart',
            colorValue: '89dadb',
            varName: '--accent-color',
          },
          {
            name: 'Accent Background',
            description: 'For areas that need a bit of contrast',
            colorValue: '7feeff',
            varName: '--accent-background',
          },
          {
            name: 'Primary',
            description: 'Primary interaction color',
            colorValue: '005eff',
            varName: '--primary-color',
          },
          {
            name: 'Success',
            description: 'Used to signify positive result',
            colorValue: '00850d',
            varName: '--success-color',
          },
          {
            name: 'Warning',
            description: 'Used to signify attention needed',
            colorValue: 'ffd000',
            varName: '--warning-color',
          },
          {
            name: 'Danger',
            description: 'Used to signify a negative result',
            colorValue: 'c70000',
            varName: '--danger-color',
          },
          {
            name: 'Emphasis',
            description: 'Crisp',
            varName: '--emphasis-color',
            colorValue: 'ffc107',
          },
          {
            name: 'Border',
            description: 'Standard border color',
            varName: '--border-color',
            colorValue: 'dc3545',
          },
        ],
      },
      themes: {
        "default-theme": [
          {
            name: 'Text',
            description: 'The color of the main text',
            varName: '--body-color',
            colorValue: '000000',
          },
          {
            name: 'Background',
            description: 'The color of the background',
            varName: '--background-color',
            colorValue: 'dbf4f4',
          },
          {
            name: 'Secondary',
            description: 'For things that should pop out',
            varName: '--secondary-color',
            colorValue: '065b5f',
          },
          {
            name: 'Secondary Background',
            description: 'For areas that should pop out',
            varName: '--secondary-background',
            colorValue: '6d9e9e',
          },
          {
            name: 'Accent',
            description: 'For things that need to be set apart',
            varName: '--accent-color',
            colorValue: '89dadb',
          },
          {
            name: 'Accent Background',
            description: 'For areas that need a bit of contrast',
            varName: '--accent-background',
            colorValue: '7feeff',
          },
          {
            name: 'Primary',
            description: 'Primary interaction color',
            varName: '--primary-color',
            colorValue: '005eff',
          },
          {
            name: 'Success',
            description: 'Used to signify positive result',
            varName: '--success-color',
            colorValue: '00850d',
          },
          {
            name: 'Warning',
            description: 'Used to signify attention needed',
            varName: '--warning-color',
            colorValue: 'ffd000',
          },
          {
            name: 'Danger',
            description: 'Used to signify a negative result',
            varName: '--danger-color',
            colorValue: 'c70000',
          },
          {
            name: 'Emphasis',
            description: 'Crisp',
            varName: '--emphasis-color',
            colorValue: 'ffc107',
          },
          {
            name: 'Border',
            description: 'Standard border color',
            varName: '--border-color',
            colorValue: 'dc3545',
          },
        ],
      }
    }
  },
  actions: {
    updateColors() {
      for (var i = 0; i < this.currentTheme.colors.length; i++) {
        const color = this.currentTheme.colors[i]
        document.documentElement.style.setProperty(color.varName, "#"+color.colorValue)
        document.documentElement.style.setProperty(color.varName+'-rgb', hex2rgb(color.colorValue))
      }
    },
    updateColor(name, colorValue, update = true) {
      const idx = R.findIndex(R.propEq(name, 'name'))(this.currentTheme.colors)
      const color = this.currentTheme.colors[idx]
      color.colorValue = colorValue
      if (update) {
        document.documentElement.style.setProperty(color.varName, "#"+color.colorValue)
        document.documentElement.style.setProperty(color.varName+'-rgb', hex2rgb(color.colorValue))
      }
    },
    changeTheme(themeName) {
      this.chosen = themeName
      if (R.has(themeName, this.themes)) {
        this.currentTheme = R.clone(this.themes[themeName])
      } else {
        this.fetchTheme(themeName)
      }
      this.updateColors()
    },
    fetchAvailable() {
      const URL = "/themes"

      fetch(URL)
        .then((response) => response.json())
        .then((data) => this.availableThemes = R.map(R.replace('.json', ''), data))
        .catch((error) => console.log("Error", error))
    },
    fetchTheme(name) {
      const URL = "/themes/"+name

      fetch(URL)
        .then((response) => response.json())
        .then((data) => {
          const fixed_colors = R.map(({name, ...rest}) => {
              return {name: name, colorValue: data.Colors[name], ...rest}
            },
            THEME_COLOR_PARTS)
          const fixed_configs = R.reduce((acc, {name, ...rest}) => R.mergeRight(acc, {[name]: {value: data.Configs[name], ...rest}}), {}, THEME_CONFIGS_PARTS)
          this.themes[name] = {configs: fixed_configs, colors: fixed_colors}

          this.changeTheme(name)
        })
        .catch((error) => console.log("Error", error))
    },
    submitTheme(name, description, update=false) {
      const URL = update ? "/themes/"+name : "/themes"
      console.log(URL)

      const colors = R.reduce((acc, {name, colorValue, ...rest}, ) => {
        acc[name] = colorValue
        return acc
      }, {}, this.currentTheme.colors)
      const configs = R.reduce((acc, {name, value, ...rest}) => ({[name]: value}),
        {},
        R.toPairs(this.currentTheme.configs))

      const payload = {
        "Name": name,
        "Description": description,
        "Version": "v1.0.0",
        "Configs": configs,
        "Colors": colors
      }

      console.log(payload)

      fetch(encodeURI(URL), {
        method: update ? "PUT" : "POST",
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(payload)
      })
    },
  },
  getters: {
    modified(state) {
      if (state.themes[state.chosen]) {
        return R.equals(
          R.pluck('colorValue', R.sortBy(R.prop('name'), state.themes[state.chosen])),
          R.pluck('colorValue', R.sortBy(R.prop('name'), state.currentTheme))
        )
      } else {
        return false
      }
    },
  }
})
