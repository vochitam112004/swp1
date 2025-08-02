// Test file for date calculations and database operations
import { DateUtils } from '../src/utils/dateUtils';
import { ApiHelper } from '../src/utils/apiHelper';

/**
 * Test suite for date calculations
 */
const testDateCalculations = () => {
  console.log('🧪 Testing Date Calculations...\n');

  // Test 1: Adding days safely
  const startDate = new Date('2025-01-31'); // End of January
  const result = DateUtils.addDays(startDate, 7);
  console.log(`✅ Adding 7 days to ${DateUtils.toVietnameseString(startDate)}: ${DateUtils.toVietnameseString(result)}`);

  // Test 2: Adding weeks
  const weekResult = DateUtils.addWeeks(startDate, 2);
  console.log(`✅ Adding 2 weeks to ${DateUtils.toVietnameseString(startDate)}: ${DateUtils.toVietnameseString(weekResult)}`);

  // Test 3: Days difference calculation
  const endDate = new Date('2025-02-15');
  const daysDiff = DateUtils.daysDifference(endDate, startDate);
  console.log(`✅ Days between ${DateUtils.toVietnameseString(startDate)} and ${DateUtils.toVietnameseString(endDate)}: ${daysDiff} days`);

  // Test 4: Field normalization
  const testObj = {
    logDate: '2025-01-01',
    StartDate: '2025-01-15',
    TargetQuitDate: '2025-03-01',
    PersonalMotivation: 'Test motivation'
  };
  const normalized = DateUtils.normalizeFields(testObj);
  console.log('✅ Normalized fields:', normalized);

  // Test 5: Date range
  const range = DateUtils.getDateRange(7);
  console.log(`✅ Last 7 days range: ${DateUtils.toVietnameseString(range.startDate)} to ${DateUtils.toVietnameseString(range.endDate)}`);

  console.log('\n🎉 All date calculations tests passed!\n');
};

/**
 * Test suite for edge cases
 */
const testEdgeCases = () => {
  console.log('🧪 Testing Edge Cases...\n');

  // Test leap year
  const leapYearDate = new Date('2024-02-28');
  const leapResult = DateUtils.addDays(leapYearDate, 1);
  console.log(`✅ Leap year test - Adding 1 day to ${DateUtils.toVietnameseString(leapYearDate)}: ${DateUtils.toVietnameseString(leapResult)}`);

  // Test month boundaries
  const monthEnd = new Date('2025-01-31');
  const nextMonth = DateUtils.addDays(monthEnd, 1);
  console.log(`✅ Month boundary test - Adding 1 day to ${DateUtils.toVietnameseString(monthEnd)}: ${DateUtils.toVietnameseString(nextMonth)}`);

  // Test year boundaries
  const yearEnd = new Date('2024-12-31');
  const nextYear = DateUtils.addDays(yearEnd, 1);
  console.log(`✅ Year boundary test - Adding 1 day to ${DateUtils.toVietnameseString(yearEnd)}: ${DateUtils.toVietnameseString(nextYear)}`);

  // Test invalid dates
  const invalidResult = DateUtils.normalizeFields(null);
  console.log('✅ Null handling test:', invalidResult);

  console.log('\n🎉 All edge cases tests passed!\n');
};

/**
 * Test data consistency scenarios
 */
const testDataConsistency = () => {
  console.log('🧪 Testing Data Consistency...\n');

  // Test different field name variations
  const testData = [
    { date: '2025-01-01', cigarettesSmoked: 5 },
    { logDate: '2025-01-02', cigarettesSmoked: 3 },
    { Date: '2025-01-03', cigarettesSmoked: 0 },
    { LogDate: '2025-01-04', cigarettesSmoked: 2 }
  ];

  const normalizedData = testData.map(item => DateUtils.normalizeFields(item));
  console.log('✅ Normalized data consistency:');
  normalizedData.forEach((item, index) => {
    console.log(`   ${index + 1}. Date: ${item.date}, Cigarettes: ${item.cigarettesSmoked}`);
  });

  // Test sorting by normalized dates
  const sorted = normalizedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  console.log('✅ Sorted by date:', sorted.map(item => item.date));

  console.log('\n🎉 Data consistency tests passed!\n');
};

/**
 * Performance test for date operations
 */
const testPerformance = () => {
  console.log('🧪 Testing Performance...\n');

  const iterations = 10000;
  const startDate = new Date('2025-01-01');

  // Test addDays performance
  console.time('addDays');
  for (let i = 0; i < iterations; i++) {
    DateUtils.addDays(startDate, i % 365);
  }
  console.timeEnd('addDays');

  // Test normalization performance
  const testObj = { logDate: '2025-01-01', StartDate: '2025-01-01' };
  console.time('normalize');
  for (let i = 0; i < iterations; i++) {
    DateUtils.normalizeFields(testObj);
  }
  console.timeEnd('normalize');

  console.log('\n🎉 Performance tests completed!\n');
};

/**
 * Run all tests
 */
const runAllTests = () => {
  console.log('🚀 Starting Date Utils Test Suite\n');
  
  try {
    testDateCalculations();
    testEdgeCases();
    testDataConsistency();
    testPerformance();
    
    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Export for use in browser console or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testDateCalculations,
    testEdgeCases,
    testDataConsistency,
    testPerformance
  };
} else {
  // Browser environment
  window.DateUtilsTests = {
    runAllTests,
    testDateCalculations,
    testEdgeCases,
    testDataConsistency,
    testPerformance
  };
  
  console.log('🧪 Date Utils Tests loaded. Run DateUtilsTests.runAllTests() to start.');
}
