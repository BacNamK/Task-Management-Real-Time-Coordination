import { Module } from '@nestjs/common';
import { BoardRepository } from './board.Repository.js';

@Module({
  imports: [BoardRepository],
  providers: [BoardRepository],
  exports: [BoardRepository],
})
export class BoardModule {}
