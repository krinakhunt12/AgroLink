# Quick Implementation Guide
## How to Use the New Container/Presentational Pattern

## Step 1: Update Home.tsx (Example)

Replace the current monolithic `Home.tsx` with this clean container component:

```typescript
// pages/Home.tsx
import React from 'react';
import { useHome } from '../hooks/useHome';
import { HeroSection } from '../components/home/HeroSection';
import { StatsBar } from '../components/home/StatsBar';
import { WeatherWidget } from '../components/home/WeatherWidget';

const Home: React.FC = () => {
  const { 
    heroContent, 
    stats, 
    weatherData, 
    t 
  } = useHome();

  return (
    <div className="flex flex-col min-h-screen font-sans bg-stone-50">
      <HeroSection {...heroContent} />
      
      <StatsBar stats={stats} />
      
      <WeatherWidget 
        weatherData={weatherData}
        title={t('weather.title')}
        subtitle={t('weather.subtitle')}
        liveUpdatesLabel={t('weather.liveUpdates')}
      />
      
      {/* Add more components as they are created */}
    </div>
  );
};

export default Home;
```

## Step 2: Benefits You'll See Immediately

### Before (370 lines)
```typescript
const Home: React.FC = () => {
  const { t } = useTranslation();
  
  const getWeatherIcon = (iconName: string) => {
    // 10 lines of logic
  };
  
  return (
    <div>
      {/* 350 lines of JSX */}
    </div>
  );
};
```

### After (~50 lines)
```typescript
const Home: React.FC = () => {
  const data = useHome();
  
  return (
    <div>
      <HeroSection {...data.heroContent} />
      <StatsBar stats={data.stats} />
      <WeatherWidget {...data.weatherProps} />
      {/* Clean, readable component composition */}
    </div>
  );
};
```

## Step 3: Create More Components

### Template for New Presentational Component

```typescript
// components/home/[ComponentName].tsx
import React from 'react';

interface [ComponentName]Props {
  // Define your props
  title: string;
  items: any[];
}

export const [ComponentName]: React.FC<[ComponentName]Props> = React.memo(({ 
  title, 
  items 
}) => {
  return (
    <section>
      <h2>{title}</h2>
      {items.map((item, index) => (
        <div key={index}>{/* Render item */}</div>
      ))}
    </section>
  );
});

[ComponentName].displayName = '[ComponentName]';
```

## Step 4: Add to Barrel Export

```typescript
// components/home/index.ts
export { HeroSection } from './HeroSection';
export { StatsBar } from './StatsBar';
export { WeatherWidget } from './WeatherWidget';
export { NewComponent } from './NewComponent'; // Add here
```

## Step 5: Use in Container

```typescript
import { HeroSection, StatsBar, WeatherWidget, NewComponent } from '../components/home';

// In your component:
<NewComponent {...data.newComponentProps} />
```

## Performance Tips

### 1. Always Use React.memo for Presentational Components
```typescript
export const MyComponent: React.FC<Props> = React.memo(({ data }) => {
  // Component logic
});
```

### 2. Memoize Data in Hooks
```typescript
const stats = useMemo(() => ([
  { value: '50k+', label: 'Farmers' }
]), [dependencies]);
```

### 3. Use useCallback for Event Handlers
```typescript
const handleClick = useCallback(() => {
  // Handle click
}, [dependencies]);
```

## Testing

### Test the Hook
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useHome } from '../hooks/useHome';

test('useHome returns correct data', () => {
  const { result } = renderHook(() => useHome());
  expect(result.current.stats).toBeDefined();
});
```

### Test the Component
```typescript
import { render } from '@testing-library/react';
import { StatsBar } from '../components/home/StatsBar';

test('StatsBar renders correctly', () => {
  const stats = [{ value: '50k+', label: 'Farmers', icon: 'Users' }];
  const { getByText } = render(<StatsBar stats={stats} />);
  expect(getByText('50k+')).toBeInTheDocument();
});
```

## Migration Checklist for Each Page

- [ ] Create custom hook in `hooks/use[PageName].ts`
- [ ] Extract all business logic to the hook
- [ ] Memoize data with `useMemo`
- [ ] Create folder `components/[pageName]/`
- [ ] Break UI into small presentational components
- [ ] Add TypeScript interfaces for all props
- [ ] Wrap components with `React.memo`
- [ ] Create barrel export `index.ts`
- [ ] Update page to use hook + components
- [ ] Test performance improvements
- [ ] Remove old code
- [ ] Update documentation

## Common Patterns

### Pattern 1: List Rendering
```typescript
interface ListItem {
  id: string;
  title: string;
}

interface ListProps {
  items: ListItem[];
  onItemClick: (id: string) => void;
}

export const List: React.FC<ListProps> = React.memo(({ items, onItemClick }) => {
  return (
    <div>
      {items.map(item => (
        <div key={item.id} onClick={() => onItemClick(item.id)}>
          {item.title}
        </div>
      ))}
    </div>
  );
});
```

### Pattern 2: Conditional Rendering
```typescript
interface CardProps {
  title: string;
  isLoading?: boolean;
  error?: string;
}

export const Card: React.FC<CardProps> = React.memo(({ title, isLoading, error }) => {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{title}</div>;
});
```

### Pattern 3: Composition
```typescript
interface ContainerProps {
  header: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = React.memo(({ 
  header, 
  content, 
  footer 
}) => {
  return (
    <div>
      <header>{header}</header>
      <main>{content}</main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
});
```

## Next Steps

1. **Complete Home Page**: Create remaining components
2. **Refactor Marketplace**: Apply same pattern
3. **Refactor ProductDetail**: Apply same pattern
4. **Refactor Cart**: Apply same pattern
5. **Measure Performance**: Use React DevTools Profiler
6. **Document**: Update component documentation

## Resources

- See `PERFORMANCE_OPTIMIZATION.md` for detailed guide
- Check `components/home/` for examples
- Review `hooks/useHome.ts` for hook pattern

---

**Quick Start**: Copy the template above and start creating components!  
**Questions**: Check the main performance guide or ask the team
