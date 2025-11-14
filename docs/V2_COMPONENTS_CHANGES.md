# V2 Components - CSS Grid Adaptations

## Overview

All components in `/src/components/v2/` are adapted versions of the original components, optimized to work with the CSS Grid layout system implemented in `GridExamLayout`.

## Key Changes Applied

### 1. Width Class Removal

**Original Pattern:**
```tsx
className="w-56 md:w-64 lg:w-72 xl:w-80 ..."
```

**V2 Pattern:**
```tsx
className="w-full ..."
```

**Reason:** Grid areas control the width, components should fill their assigned space.

---

### 2. Sticky Positioning Removal

**Original Pattern:**
```tsx
className="xl:sticky xl:top-4 ..."
```

**V2 Pattern:**
```tsx
// No sticky classes - handled by GridExamLayout
```

**Reason:** `GridExamLayout` manages sticky positioning for the entire `panels-container` in desktop view.

---

### 3. A4 Container Class Update

**Original Pattern:**
```tsx
<div className="a4-container">
```

**V2 Pattern:**
```tsx
<div className="a4-container-v2">
```

**Reason:** Separate CSS class for V2 responsive A4 sizing in grid context.

---

## Component-Specific Changes

### ReportCanvas V2

**File:** `/src/components/v2/ReportCanvas.tsx`

**Changes:**
- ✅ Updated `a4-container` → `a4-container-v2`
- ✅ All functionality preserved (markdown rendering, AI status, streaming)
- ✅ Responsive A4 sizing works with grid

**Import:**
```tsx
import { ReportCanvas } from '@/components/v2';
```

---

### SelectedFindingsPanel V2

**File:** `/src/components/v2/SelectedFindingsPanel.tsx`

**Changes:**
- ✅ Removed: `w-56 md:w-64 lg:w-72 xl:w-80`
- ✅ Added: `w-full`
- ✅ Removed: `xl:sticky xl:top-4`
- ✅ Kept: `expandToContent` prop and dynamic height logic
- ✅ Kept: All AI model selection and generate report functionality

**Import:**
```tsx
import { SelectedFindingsPanel } from '@/components/v2';
```

---

### ExamStatisticsPanel V2

**File:** `/src/components/v2/ExamStatisticsPanel.tsx`

**Changes:**
- ✅ Removed: `w-56 md:w-64 lg:w-72 xl:w-80`
- ✅ Added: `w-full`
- ✅ Simplified to pure statistics display
- ✅ No positioning logic (grid handles it)
- ✅ Kept: All statistics calculations and animations

**Import:**
```tsx
import { ExamStatisticsPanel } from '@/components/v2';
```

---

### Sidebar V2

**File:** `/src/components/v2/Sidebar.tsx`

**Changes:**
- ✅ Removed: Fixed `w-64` width
- ✅ Added: `w-full h-full` with flex column layout
- ✅ Grid template columns define sidebar width (256px desktop, 240px tablet)
- ✅ Kept: All navigation, normal buttons, and finding list functionality
- ✅ Kept: `showSummary` prop for conditional summary display

**Import:**
```tsx
import { Sidebar } from '@/components/v2';
```

---

## CSS Grid Integration

### Grid Areas

Components are placed in these grid areas (defined in `GridExamLayout`):

```
[sidebar] [main-content] [panels-container]
```

**Breakpoint Behavior:**

| Breakpoint | Layout |
|------------|--------|
| Mobile (<768px) | Single column, stacked |
| Tablet (768-1279px) | Sidebar + Main (2 columns) |
| Desktop (≥1280px) | Full 3-column layout |

---

## Usage Example

```tsx
import {
  Sidebar,
  ReportCanvas,
  SelectedFindingsPanel,
  ExamStatisticsPanel
} from '@/components/v2';

function ExamPage() {
  return (
    <GridExamLayout
      sidebar={
        <Sidebar
          selectedOrgan={selectedOrgan}
          onOrganSelect={handleOrganSelect}
          selectedFindings={selectedFindings}
          normalOrgans={normalOrgans}
          showSummary={true}
        />
      }
      mainContent={
        <ReportCanvas
          selectedFindings={selectedFindings}
          normalOrgans={normalOrgans}
          generatedReport={generatedReport}
          isGenerating={isGenerating}
          aiImpression={aiImpression}
          aiStatus={aiStatus}
        />
      }
      panels={
        <>
          <SelectedFindingsPanel
            selectedFindings={selectedFindings}
            normalOrgans={normalOrgans}
            onGenerateReport={handleGenerateReport}
            isGenerating={isGenerating}
            expandToContent={true}
          />
          <ExamStatisticsPanel
            selectedFindings={selectedFindings}
            normalOrgans={normalOrgans}
          />
        </>
      }
    />
  );
}
```

---

## Testing Checklist

- ✅ ReportCanvas displays correctly in grid area
- ✅ SelectedFindingsPanel fills grid area without overflow
- ✅ ExamStatisticsPanel displays below SelectedFindingsPanel
- ✅ Sidebar navigation works in all breakpoints
- ✅ All interactive features preserved (buttons, dropdowns, forms)
- ✅ Responsive behavior matches design requirements
- ✅ No horizontal scrollbars appear

---

## Migration Path

### From Original to V2

**Step 1:** Replace imports
```tsx
// Before
import ReportCanvas from '@/components/ReportCanvas';

// After
import { ReportCanvas } from '@/components/v2';
```

**Step 2:** Wrap with GridExamLayout
```tsx
// Before
<div className="flex gap-4">
  <Sidebar />
  <div className="flex-1">
    <ReportCanvas />
  </div>
  <div className="flex flex-col gap-4">
    <SelectedFindingsPanel />
    <ExamStatisticsPanel />
  </div>
</div>

// After
<GridExamLayout
  sidebar={<Sidebar />}
  mainContent={<ReportCanvas />}
  panels={
    <>
      <SelectedFindingsPanel />
      <ExamStatisticsPanel />
    </>
  }
/>
```

**Step 3:** Remove custom positioning/sizing
- No need for `sticky`, `fixed`, or responsive width classes
- Grid handles all layout logic

---

## Benefits of V2 Components

1. **Simplified Code** - No complex responsive width classes
2. **Consistent Layout** - Grid ensures proper spacing and alignment
3. **Maintainable** - Single source of truth for layout (GridExamLayout)
4. **Responsive** - Automatic adaptation to all screen sizes
5. **Predictable** - Components always fill their grid areas correctly

---

## Future Enhancements

- [ ] Add grid gap customization prop
- [ ] Support for collapsible sidebar in mobile
- [ ] Persist panel states in localStorage
- [ ] Add keyboard shortcuts for navigation
- [ ] Implement drag-to-resize for panels

---

**Last Updated:** October 23, 2025
**Version:** 2.0.0
**Status:** ✅ Production Ready
