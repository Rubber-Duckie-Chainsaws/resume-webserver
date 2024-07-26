<template>
  <div class="header">
    <header :class="headerClass">
      <nav :class="linkAlign" class="navbar-container" >
        <h1 class="navbar-brand">
          <slot name="brand"></slot>
        </h1>
        <button
          type="button"
          class="hamburger-toggle navbar-toggle"
          @click="toggleMenu"
          ref="navbarToggle"
          aria-controls="navbar-menu"
          aria-label="Toggle Menu"
          aria-expanded="false">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <div class='nav-links'>
          <ul>
            <li v-for="link in links"><RouterLink @click="closeMenu" class="nav-link" :to="link.route">{{ link.name }}</RouterLink></li>
          </ul>
        </div>
      </nav>
    </header>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useThemeStore } from '@/stores/theme'

  const themes = useThemeStore()

  const { currentTheme } = storeToRefs(themes)

  const props = defineProps({
    links: Array,
    primary: {
      type: Boolean,
      default: true
    },
    center: {
      type: Boolean,
      default: false
    }
  })

  const navbarToggle = ref()

  function closeMenu() {
    navbarToggle.value.ariaExpanded = "false"
  }

  function toggleMenu() {
    navbarToggle.value.ariaExpanded = navbarToggle.value.ariaExpanded === "false" ? "true" : "false"
  }

  const headerClass = computed(() => {
    return props.primary ? currentTheme.value.configs.primaryHeader.value : currentTheme.value.configs.secondaryHeader.value
  })

  const linkAlign = computed(() => {
    if (props.center) {
      return "centerAlign"
    } else {
      return currentTheme.value.configs.headerAlignment.value + "Align"
    }
  })
</script>

<style scoped>
  .header {
    padding-bottom: 2em;
  }

  .navbar-container {
    display: flex;
    width: 100%;
    align-items: stretch;
    &.rightAlign {
      justify-content: space-between;
    }

    &.leftAlign {
      justify-content: flex-start;
    }
    &.centerAlign {
      justify-content: space-around;
    }
  }

  .navbar-toggle {
    order: 2;
  }

  a, a:visited, a:hover, a:active {
    filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
    mix-blend-mode: luminosity;
    opacity: 0.95;
  }

  :slotted(a, a:visited, a:hover, a:active) {
    filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
    mix-blend-mode: luminosity;
    opacity: 0.95;
  }

  .nav-links {
    flex: 1 0 0;
    order: 1;
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 800ms ease-in-out;
    & ul, ol {
      overflow: hidden;
      margin: 0;
      padding: 0;
      display: flex;
      list-style: none;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
    }
    & li {
      flex: 1 0 0;
      padding: 0 5px;
      white-space: nowrap;
      &:hover {
        background: rgba(255, 255, 255, 0.4);
      }

      & a {
        display: block;
        padding: 1em 0;
        height: 100%;
        width: 100%;
      }
    }
  }

  .navbar-toggle[aria-expanded='true'] + .nav-links {
    grid-template-rows: 1fr;
  }

  .navbar-brand {
    padding: 0.4em;
    margin: 0;
    font-weight: bold;
    font-size: 28px;
    min-width: 100px;
  }

  :slotted(.navbar-brand) {
    display: flex;
    flex: 0 0 0;
    align-items: center;
    white-space: nowrap;
  }

  @media only screen and (min-width: 768px) {
    .navbar-container {
      display: flex;
      width: 100%;
      flex: 0 1 100px;
      justify-content: space-between;
      align-items: baseline;
    }

    .navbar-toggle {
      background-color: transparent;
      display: none;
      width: 30px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      order: 2;
    }

    .nav-links {
      flex: 0 1 0;
      display: block;
      transition: grid-template-rows 800ms ease-in-out;
      & ul, ol {
        align-self: flex-end;
        background: inherit;
        flex-direction: row;
        justify-content: space-between;
      }
      & li {
        & a {
          padding: 1em 0.5em;
        }
      }
    }
  }
</style>
