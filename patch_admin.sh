#!/bin/bash
sed -i -e '/import { useState } from '\''react'\'';/ s/import { useState } from '\''react'\'';/import { useState, useMemo } from '\''react'\'';/' resources/js/pages/DashboardAdmin.tsx
sed -i -e '/import type { AdminMenuType } from '\''@\/pages\/Components\/DashboardAdmin\/AdminSidebar'\'';/ a\
import type { HotspotCategory, ConfidenceLevel } from '\''@\/hooks\/useWildfireData'\'';' resources/js/pages/DashboardAdmin.tsx
