const getRuleId = require('../index').getRuleId;

describe('get-rule-id', () => {
  it('should be able to get rule ID from rule:severity', function () {
    expect(getRuleId('no-implicit-this:error')).toBe('no-implicit-this');
  });

  it('should be able to get rule ID from rule:["severity", { configObject }]', function () {
    expect(
      getRuleId('no-implicit-this:["error", { "allow": ["some-helper"] }]')
    ).toBe('no-implicit-this');
    expect(
      getRuleId('no-implicit-this:["warn", { "allow": ["some-helper"] }]')
    ).toBe('no-implicit-this');
    expect(
      getRuleId('no-implicit-this:["off", { "allow": ["some-helper"] }]')
    ).toBe('no-implicit-this');
  });
});
