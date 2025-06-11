# Test Documentation

Ця директорія містить unit тести для бізнес-логіки MCP сервера.

## Структура тестів

```
tests/
└── unit-business.test.ts       # Unit тести для бізнес-логіки (GreetingService)
```

## Команди для запуску тестів

### Основні команди

```bash
# Запустити всі тести
npm run test

# Запустити тести у режимі спостереження
npm run test:watch

# Запустити тести з покриттям коду
npm run test:coverage

# Запустити тести для CI/CD
npm run test:ci
```

### Специфічні команди

```bash
# Запустити тести для конкретного файлу
npm test -- unit-business.test.ts

# Запустити з детальним виводом
npm test -- --verbose
```

## Тип тестів

### Unit тести для бізнес-логіки
- Тестують тільки основну бізнес-логіку `GreetingService`
- Без зовнішніх залежностей
- Швидкі у виконанні
- 100% покриття бізнес-коду

**Що тестується:**
- Генерація привітань (`generateGreeting`)
- Генерація прощань (`generateFarewell`)
- Обробка різних типів імен (порожні, спеціальні символи, Unicode)
- Валідація бізнес-логіки

## Конфігурація

### Jest Configuration
- **Preset:** `ts-jest/presets/default-esm` для підтримки ES модулів
- **Environment:** Node.js
- **Coverage:** Збирається з усіх файлів у `src/`
- **Timeout:** 10 секунд для всіх тестів

### TypeScript Support
- Повна підтримка TypeScript
- ES модулі з правильною конфігурацією
- Автоматичне перетворення `.ts` файлів

## Найкращі практики

### 1. Структура тестів (AAA Pattern)
```typescript
it('should do something', () => {
  // Arrange - підготовка
  const input = 'test';
  
  // Act - виконання
  const result = functionUnderTest(input);
  
  // Assert - перевірка
  expect(result).toBe('expected');
});
```

### 2. Описові назви тестів
- Використовуйте дієслова: `should`, `must`, `will`
- Описуйте очікувану поведінку
- Включайте контекст коли необхідно

### 3. Моки та стаби
- Мокайте зовнішні залежності
- Використовуйте `beforeEach` для скидання моків
- Перевіряйте виклики моків

### 4. Тестові дані
- Використовуйте `TestData` утиліти
- Тестуйте граничні випадки
- Включайте спеціальні символи та Unicode

## Допоміжні утиліти

### TestHelpers
```typescript
import { createTestServer, TestData } from '../utils/test-helpers.js';

const server = createTestServer();
const randomName = TestData.randomString();
```

### ConsoleCapture
```typescript
import { ConsoleCapture } from '../utils/test-helpers.js';

const console = new ConsoleCapture();
console.start();
// ... тестовий код
expect(console.errors).toHaveLength(1);
console.stop();
```

### Custom Matchers
```typescript
expect(greeting).toBeGreeting();
expect(farewell).toBeFarewell();
```

## Покриття коду

Цільові показники покриття:
- **Statements:** > 90%
- **Branches:** > 85%
- **Functions:** > 95%
- **Lines:** > 90%

Виключення з покриття:
- Файли типів (`.d.ts`)
- Індексні файли (`index.ts`)
- Конфігураційні файли

## Troubleshooting

### Загальні проблеми

1. **ES Modules помилки**
   - Переконайтеся, що використовуєте `.js` розширення в імпортах
   - Перевірте конфігурацію Jest для ESM

2. **TypeScript помилки**
   - Перевірте налаштування `tsconfig.json`
   - Переконайтеся, що типи встановлені

3. **Повільні тести**
   - Використовуйте моки замість реальних сервісів
   - Збільште timeout якщо необхідно

4. **Проблеми з покриттям**
   - Перевірте виключення в Jest config
   - Переконайтеся, що файли включені в `collectCoverageFrom`

## CI/CD Integration

Для інтеграції з CI/CD використовуйте:

```bash
npm run test:ci
```

Ця команда:
- Запускає тести без режиму спостереження
- Генерує звіт про покриття
- Відповідає для CI/CD середовищ 