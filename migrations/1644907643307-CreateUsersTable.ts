import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1644907643307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            type: 'uuid',
            name: 'id',
            isPrimary: true,
            isNullable: false,
            default: 'uuid_generate_v4()',
          },
          {
            type: 'uuid',
            name: 'auth_id',
            isUnique: true,
            isNullable: false,
          },
          {
            type: 'varchar',
            name: 'name',
            length: '255',
            isNullable: false,
          },
          {
            type: 'timestamp',
            name: 'created_at',
            isNullable: false,
            default: 'NOW()',
          },
          {
            type: 'timestamp',
            name: 'updated_at',
            isNullable: false,
            default: 'NOW()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
