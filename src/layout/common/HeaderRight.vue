<template>
  <div class="header-right">
    <div class="header-right__search">
      <GlobalSearch />
    </div>

    <div class="header-right__workspace">
      <TenantSelect />
    </div>

    <div class="header-right__actions">
      <ThemeToggle />
      <FullscreenButton />
      <NotificationsPopover />
    </div>

    <div class="header-right__profile">
      <UserDropdown />
    </div>
  </div>
</template>

<script setup lang="ts">
import FullscreenButton from '@/layout/common/header-right/FullscreenButton.vue'
import GlobalSearch from '@/layout/common/header-right/GlobalSearch.vue'
import NotificationsPopover from '@/layout/common/header-right/NotificationsPopover.vue'
import TenantSelect from '@/layout/common/header-right/TenantSelect.vue'
import ThemeToggle from '@/layout/common/header-right/ThemeToggle.vue'
import UserDropdown from '@/layout/common/header-right/UserDropdown.vue'
</script>

<style scoped>
.header-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: 0;
}

.header-right__search,
.header-right__workspace,
.header-right__actions,
.header-right__profile {
  flex: 0 0 auto;
  min-width: 0;
}

.header-right__search {
  width: 264px;
}

.header-right__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--layout-header-bg) 74%, #ffffff 26%);
  border: 1px solid color-mix(in srgb, var(--layout-header-border) 86%, transparent);
}

@media (max-width: 1280px) {
  .header-right {
    gap: 8px;
  }

  .header-right__search {
    width: 220px;
  }
}

@media (max-width: 768px) {
  .header-right__workspace,
  .header-right__search {
    display: none;
  }

  .header-right__actions {
    gap: 4px;
    padding: 2px;
    border-radius: 12px;
  }
}
</style>
