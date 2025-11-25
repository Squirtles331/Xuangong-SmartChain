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
import TenantSelect from '@/layout/common/header-right/TenantSelect.vue'
import GlobalSearch from '@/layout/common/header-right/GlobalSearch.vue'
import SettingsButton from '@/layout/common/header-right/SettingsButton.vue'
import ThemeToggle from '@/layout/common/header-right/ThemeToggle.vue'
import LangSwitcher from '@/layout/common/header-right/LangSwitcher.vue'
import FullscreenButton from '@/layout/common/header-right/FullscreenButton.vue'
import NotificationsPopover from '@/layout/common/header-right/NotificationsPopover.vue'
import UserDropdown from '@/layout/common/header-right/UserDropdown.vue'
</script>

<style scoped>
.header-right {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
