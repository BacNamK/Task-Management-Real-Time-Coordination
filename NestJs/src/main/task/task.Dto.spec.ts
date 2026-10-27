import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { TaskDto } from './task.Dto.js';

describe('TaskDto', () => {
  const validationOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
  };

  it('accepts a task payload including nested assignees', () => {
    const dto = plainToInstance(TaskDto, {
      title: 'Task',
      position: 0,
      description: 'Details',
      cycleId: '3',
      boardId: '2',
      dueDate: '2026-10-27T00:00:00.000Z',
      assigneeds: [{ userId: '1' }],
    });

    expect(validateSync(dto, validationOptions)).toEqual([]);
  });

  it('accepts optional nullable fields', () => {
    const dto = plainToInstance(TaskDto, {
      title: 'Task',
      position: 0,
      cycleId: null,
      dueDate: null,
      boardId: '2',
      assigneeds: [],
    });

    expect(validateSync(dto, validationOptions)).toEqual([]);
  });

  it('rejects an unknown nested assignee property', () => {
    const dto = plainToInstance(TaskDto, {
      title: 'Task',
      position: 0,
      boardId: '2',
      assigneeds: [{ userId: '1', unexpected: true }],
    });

    const errors = validateSync(dto, validationOptions);

    expect(errors[0]?.children?.[0]?.children?.[0]?.property).toBe(
      'unexpected',
    );
  });
});
