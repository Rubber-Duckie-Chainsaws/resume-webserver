<template>
  <header>
    <nav class="navbar-container">
      <slot name="brand"></slot>
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
</template>

<script setup>
  import { ref } from 'vue'

  const props = defineProps({
    links: Array
  })

  const navbarToggle = ref()

  function closeMenu() {
    navbarToggle.value.ariaExpanded = "false"
  }

  function toggleMenu() {
    navbarToggle.value.ariaExpanded = navbarToggle.value.ariaExpanded === "false" ? "true" : "false"
  }
</script>

<style scoped>
.navbar-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: stretch;
}

.navbar-toggle {
  order: 2;
}

a, a:visited, a:hover, a:active {
  color: inherit;
}

:slotted(a, a:visited, a:hover, a:active) {
  color: inherit;
}

.nav-links {
  background: transparent;
  flex: 1 0 0;
  order: 1;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 800ms ease-in-out, background 900ms ease;
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
    border-left: 0;
    &:first-child {
      border-left: 0;
    }
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
  background: rgba(0, 0, 0, 0.4);
  grid-template-rows: 1fr;
}

:slotted(.navbar-brand) {
  display: flex;
  flex: 0 0 0;
  align-items: center;
  min-width: 100px;
  font-weight: bold;
  font-size: 18px;
  white-space: nowrap
}

@media only screen and (min-width: 768px) {
  .navbar-container {
    display: flex;
    width: 100%;
    flex: 0 1 100px;
    justify-content: space-between;
    align-items: center;
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
    background: transparent;
    flex: 0 1 0;
    order: 1;
    display: block;
    transition: grid-template-rows 800ms ease-in-out, background 900ms ease;
    & ul, ol {
      overflow: hidden;
      margin: 0;
      padding: 0;
      display: flex;
      list-style: none;
      flex-direction: row;
      justify-content: space-between;
    }
    & li {
      flex: 1 0 0;
      border-left: 1px solid var(--accent-background);
      &:hover {
        background: rgba(255, 255, 255, 0.4);
      }

      & a {
        display: block;
        padding: 1em 2em;
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>
