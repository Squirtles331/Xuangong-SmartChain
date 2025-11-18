<template>
  <div class="header-right">
    <TenantSelect />
    <GlobalSearch />
    <SettingsButton />
    <ThemeToggle />
    <LangSwitcher />
    <FullscreenButton />
    <NotificationsPopover />
    <UserDropdown />
  </div>
</template>

<script setup lang="ts">
import TenantSelect from '@/layout/header/header-right/TenantSelect.vue'
import GlobalSearch from '@/layout/header/header-right/GlobalSearch.vue'
import SettingsButton from '@/layout/header/header-right/SettingsButton.vue'
import ThemeToggle from '@/layout/header/header-right/ThemeToggle.vue'
import LangSwitcher from '@/layout/header/header-right/LangSwitcher.vue'
import FullscreenButton from '@/layout/header/header-right/FullscreenButton.vue'
import NotificationsPopover from '@/layout/header/header-right/NotificationsPopover.vue'
import UserDropdown from '@/layout/header/header-right/UserDropdown.vue'
</script>

<style scoped>
.header-right {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
