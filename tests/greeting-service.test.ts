/**
 * Unit tests for business logic - GreetingService
 * Tests the core business functionality without external dependencies
 */

// Import the actual service directly
import { GreetingService } from '../src/core/services/greeting-service.js';

describe('GreetingService - Business Logic Unit Tests', () => {
  describe('generateGreeting method', () => {
    it('should generate correct greeting format', () => {
      // Arrange
      const name = 'Тестовий Користувач';
      
      // Act
      const result = GreetingService.generateGreeting(name);
      
      // Assert
      expect(result).toBe('Hello, Тестовий Користувач! Welcome to the MCP Server.');
      expect(result).toContain('Hello,');
      expect(result).toContain(name);
      expect(result).toContain('Welcome to the MCP Server.');
    });

    it('should handle empty name', () => {
      // Arrange
      const name = '';
      
      // Act
      const result = GreetingService.generateGreeting(name);
      
      // Assert
      expect(result).toBe('Hello, ! Welcome to the MCP Server.');
    });

    it('should handle special characters in names', () => {
      // Arrange
      const testCases = [
        'José María',
        'François Müller',
        '李小明',
        'محمد الأحمد',
        'Владислав'
      ];
      
      testCases.forEach(name => {
        // Act
        const result = GreetingService.generateGreeting(name);
        
        // Assert
        expect(result).toContain(name);
        expect(result).toMatch(/^Hello, .+ Welcome to the MCP Server\.$/);
      });
    });

    it('should handle very long names', () => {
      // Arrange
      const longName = 'A'.repeat(1000);
      
      // Act
      const result = GreetingService.generateGreeting(longName);
      
      // Assert
      expect(result).toContain(longName);
      expect(result.length).toBeGreaterThan(1000);
    });

    it('should handle names with whitespace', () => {
      // Arrange
      const testCases = [
        '  Leading spaces',
        'Trailing spaces  ',
        '  Both sides  ',
        'Multiple   spaces   between'
      ];
      
      testCases.forEach(name => {
        // Act
        const result = GreetingService.generateGreeting(name);
        
        // Assert
        expect(result).toContain(name);
        expect(result).toBe(`Hello, ${name}! Welcome to the MCP Server.`);
      });
    });
  });

  describe('generateFarewell method', () => {
    it('should generate correct farewell format', () => {
      // Arrange
      const name = 'Прощальний Користувач';
      
      // Act
      const result = GreetingService.generateFarewell(name);
      
      // Assert
      expect(result).toBe('Goodbye, Прощальний Користувач! Thank you for using the MCP Server.');
      expect(result).toContain('Goodbye,');
      expect(result).toContain(name);
      expect(result).toContain('Thank you for using the MCP Server.');
    });

    it('should handle empty name in farewell', () => {
      // Arrange
      const name = '';
      
      // Act
      const result = GreetingService.generateFarewell(name);
      
      // Assert
      expect(result).toBe('Goodbye, ! Thank you for using the MCP Server.');
    });

    it('should maintain consistent message structure', () => {
      // Arrange
      const names = ['User1', 'User2', 'User3'];
      
      names.forEach(name => {
        // Act
        const result = GreetingService.generateFarewell(name);
        
        // Assert
        expect(result).toMatch(/^Goodbye, .+ Thank you for using the MCP Server\.$/);
        expect(result.split('!').length).toBe(2); // One exclamation mark
      });
    });
  });

  describe('Business Logic Validation', () => {
    it('should produce different messages for greeting vs farewell', () => {
      // Arrange
      const name = 'TestUser';
      
      // Act
      const greeting = GreetingService.generateGreeting(name);
      const farewell = GreetingService.generateFarewell(name);
      
      // Assert
      expect(greeting).not.toBe(farewell);
      expect(greeting).toContain('Hello');
      expect(farewell).toContain('Goodbye');
    });

    it('should be deterministic (same input produces same output)', () => {
      // Arrange
      const name = 'Consistent User';
      
      // Act - call multiple times
      const greeting1 = GreetingService.generateGreeting(name);
      const greeting2 = GreetingService.generateGreeting(name);
      const farewell1 = GreetingService.generateFarewell(name);
      const farewell2 = GreetingService.generateFarewell(name);
      
      // Assert
      expect(greeting1).toBe(greeting2);
      expect(farewell1).toBe(farewell2);
    });

    it('should handle null-like values gracefully', () => {
      // Note: TypeScript should prevent null/undefined, but testing string conversion
      const testCases = [
        'null',
        'undefined',
        '0',
        'false'
      ];
      
      testCases.forEach(value => {
        // Act & Assert - should not throw
        expect(() => GreetingService.generateGreeting(value)).not.toThrow();
        expect(() => GreetingService.generateFarewell(value)).not.toThrow();
      });
    });

    it('should maintain proper message lengths', () => {
      // Arrange
      const shortName = 'A';
      const mediumName = 'John Doe';
      const longName = 'Very Long User Name That Goes On And On';
      
      // Act
      const shortGreeting = GreetingService.generateGreeting(shortName);
      const mediumGreeting = GreetingService.generateGreeting(mediumName);
      const longGreeting = GreetingService.generateGreeting(longName);
      
      // Assert - longer names should produce longer messages
      expect(longGreeting.length).toBeGreaterThan(mediumGreeting.length);
      expect(mediumGreeting.length).toBeGreaterThan(shortGreeting.length);
      
      // But all should have the base message
      const baseLength = 'Hello, ! Welcome to the MCP Server.'.length;
      expect(shortGreeting.length).toBeGreaterThanOrEqual(baseLength);
    });
  });
}); 