<template>
  <div class="header-right">
    <GlobalSearch />
    <ThemeToggle />
    <FullscreenButton />
    <NotificationsPopover />
    <UserDropdown />
  </div>
</template>

<script setup lang="ts">
import GlobalSearch from '@/layout/common/header-right/GlobalSearch.vue'
import ThemeToggle from '@/layout/common/header-right/ThemeToggle.vue'
import FullscreenButton from '@/layout/common/header-right/FullscreenButton.vue'
import NotificationsPopover from '@/layout/common/header-right/NotificationsPopover.vue'
import UserDropdown from '@/layout/common/header-right/UserDropdown.vue'
</script>

<style scoped>
.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 0 0 auto;
}
</style>
