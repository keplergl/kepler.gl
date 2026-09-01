import {toolToCommand} from './command-wrappers';

type CommandResult = {success: boolean; error?: string; data?: Record<string, unknown>};

describe('toolToCommand', () => {
  it('propagates a failure carried in the message field (not just error)', async () => {
    const tool = {
      execute: async () => ({success: false, message: 'boom: bad input'})
    };
    const cmd = toolToCommand(tool as any, {id: 'test.tool', name: 'Test'});
    const result = (await cmd.execute({} as any, {})) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toBe('boom: bad input');
  });

  it('propagates a failure carried in the error field', async () => {
    const tool = {
      execute: async () => ({success: false, error: 'boom: bad input'})
    };
    const cmd = toolToCommand(tool as any, {id: 'test.tool', name: 'Test'});
    const result = (await cmd.execute({} as any, {})) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toBe('boom: bad input');
  });

  it('falls back to a generic message when a failure carries neither field', async () => {
    const tool = {
      execute: async () => ({success: false})
    };
    const cmd = toolToCommand(tool as any, {id: 'test.tool', name: 'Test'});
    const result = (await cmd.execute({} as any, {})) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toBe('Tool execution failed.');
  });

  it('returns no error on success', async () => {
    const tool = {
      execute: async () => ({success: true, details: 'ok'})
    };
    const cmd = toolToCommand(tool as any, {id: 'test.tool', name: 'Test'});
    const result = (await cmd.execute({} as any, {})) as CommandResult;

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('surfaces a thrown error', async () => {
    const tool = {
      execute: async () => {
        throw new Error('kaboom');
      }
    };
    const cmd = toolToCommand(tool as any, {id: 'test.tool', name: 'Test'});
    const result = (await cmd.execute({} as any, {})) as CommandResult;

    expect(result.success).toBe(false);
    expect(result.error).toBe('kaboom');
  });
});
