import { defineStore } from 'pinia'
import { hex2rgb } from '@/composables/global.js'
import * as R from 'ramda'

const THEME_PARTS = [
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
	name: "Secondary",
    description: 'For things that should pop out',
    varName: '--secondary-color',
  },
  {
	name: "Secondary Background",
    description: 'For areas that should pop out',
    varName: '--secondary-background',
  },
  {
	name: "Accent",
    description: 'For things that need to be set apart',
    varName: '--accent-color',
  },
  {
	name: "Accent Background",
    description: 'For areas that need a bit of contrast',
    varName: '--accent-background',
  },
  {
	name: "Primary",
    description: 'Primary interaction color',
    varName: '--primary-color',
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
    name: 'Emphasis',
    description: 'Crisp',
    varName: '--emphasis-color',
  },
  {
    name: 'Border',
    description: 'Standard border color',
    varName: '--border-color',
  },
]

export const useThemeStore = defineStore('theme', {
  state: () => {
    return {
      chosen: "default-theme",
      availableThemes: ["default-theme"],
      currentTheme: [
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
      for (var i = 0; i < this.currentTheme.length; i++) {
        const color = this.currentTheme[i]
        document.documentElement.style.setProperty(color.varName, "#"+color.colorValue)
        document.documentElement.style.setProperty(color.varName+'-rgb', hex2rgb(color.colorValue))
      }
    },
    updateColor(name, colorValue, update = true) {
      const idx = R.findIndex(R.propEq(name, 'name'))(this.currentTheme)
      const color = this.currentTheme[idx]
      color.colorValue = colorValue
      if (update) {
        document.documentElement.style.setProperty(color.varName, "#"+color.colorValue)
        document.documentElement.style.setProperty(color.varName+'-rgb', hex2rgb(color.colorValue))
      }
    },
    changeTheme(themeName) {
      this.chosen = themeName
      console.log(themeName)
      console.log(this.themes)
      if (R.has(themeName, this.themes)) {
        this.currentTheme = R.clone(this.themes[themeName])
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
          const fixed_theme = R.map(({name, ...rest}) => {
              return {name: name, colorValue: data.Colors[name], ...rest}
            },
            THEME_PARTS)
          this.themes[name] = fixed_theme

          this.changeTheme(name)
        })
        .catch((error) => console.log("Error", error))
    },
    submitTheme(name, description) {
      const URL = "/themes"

      const colors = R.reduce((acc, {name, colorValue, ...rest}, ) => {
        acc[name] = colorValue
        return acc
      }, {}, this.currentTheme)

      const payload = {
        "Name": name,
        "Description": description,
        "Version": "v1.0.0",
        "Colors": colors
      }

      fetch(URL, {
        method: "POST",
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(payload)
      })
    },
  }
})
