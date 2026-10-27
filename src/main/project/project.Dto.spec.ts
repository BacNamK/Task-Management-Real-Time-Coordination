import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateDto } from './project.Dto.js';

describe('CreateDto', () => {
  it('accepts a project name', () => {
    const dto = plainToInstance(CreateDto, { projectName: 'My project' });

    expect(
      validateSync(dto, { whitelist: true, forbidNonWhitelisted: true }),
    ).toEqual([]);
  });

  it('rejects an empty project name', () => {
    const dto = plainToInstance(CreateDto, { projectName: '' });

    expect(validateSync(dto)).toHaveLength(1);
  });
});
