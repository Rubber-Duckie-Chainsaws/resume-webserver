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
          primaryHeader: {value: "primary", options: ["primary", "dark", "lighty"]},
          secondaryHeader: {value: "dark", options: ["primary", "dark", "lighty"]},
          headerAlignment: {value: "left", options: ["left", "right"]}
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
            colorValue: 'ffffff',
            varName: '--background-color',
          },
          {
            name: 'Callout',
            description: 'For areas that should pop out',
            colorValue: 'c4c4c4',
            varName: '--callout-color',
          },
          {
            name: 'Accent',
            description: 'For things that need to be set apart',
            colorValue: '828282',
            varName: '--accent-color',
          },
          {
            name: 'Primary',
            description: 'Primary interaction color',
            colorValue: '005eff',
            varName: '--primary-color',
          },
          {
            name: 'Secondary',
            description: 'For things that should pop out',
            colorValue: '636363',
            varName: '--secondary-color',
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
            name: 'Info',
            description: 'For areas that need a bit of contrast',
            colorValue: '7feeff',
            varName: '--info-color',
          },
          {
            name: 'Border',
            description: 'Standard border color',
            varName: '--border-color',
            colorValue: '000000',
          },
          {
            name: 'Light',
            description: 'Standard border color',
            varName: '--light-color',
            colorValue: '303030',
          },
          {
            name: 'Dark',
            description: 'Standard border color',
            varName: '--dark-color',
            colorValue: '000000',
          },
        ],
      },
      themes: {
        "default-theme": {
          configs: {
            primaryHeader: {value: "primary", options: ["primary", "dark", "lighty"]},
            secondaryHeader: {value: "dark", options: ["primary", "dark", "lighty"]},
            headerAlignment: {value: "left", options: ["left", "right"]}
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
              colorValue: 'ffffff',
              varName: '--background-color',
            },
            {
              name: 'Callout',
              description: 'For areas that should pop out',
              colorValue: 'c4c4c4',
              varName: '--callout-color',
            },
            {
              name: 'Accent',
              description: 'For things that need to be set apart',
              colorValue: '828282',
              varName: '--accent-color',
            },
            {
              name: 'Primary',
              description: 'Primary interaction color',
              colorValue: '005eff',
              varName: '--primary-color',
            },
            {
              name: 'Secondary',
              description: 'For things that should pop out',
              colorValue: '636363',
              varName: '--secondary-color',
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
              name: 'Info',
              description: 'For areas that need a bit of contrast',
              colorValue: '7feeff',
              varName: '--info-color',
            },
            {
              name: 'Border',
              description: 'Standard border color',
              varName: '--border-color',
              colorValue: '000000',
            },
            {
              name: 'Light',
              description: 'Standard border color',
              varName: '--light-color',
              colorValue: '303030',
            },
            {
              name: 'Dark',
              description: 'Standard border color',
              varName: '--dark-color',
              colorValue: '000000',
            },
          ],
        },
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
      const configs = R.reduce((acc, [name, {value, ...rest}]) => R.mergeLeft(acc, {[name]: value}),
        {}, R.toPairs(this.currentTheme.configs))

      const payload = {
        "Name": name,
        "Description": description,
        "Version": "v1.0.0",
        "Configs": configs,
        "Colors": colors
      }

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
