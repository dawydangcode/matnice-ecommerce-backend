import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateWishlistItemTable1697000000000
  implements MigrationInterface
{
  name = 'CreateWishlistItemTable1697000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'wishlist_item',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'item_type',
            type: 'enum',
            enum: ['product', 'lens'],
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'lens_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'selected_color_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'added_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'bigint',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['product_id'],
            referencedTableName: 'product',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['lens_id'],
            referencedTableName: 'lens',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['selected_color_id'],
            referencedTableName: 'product_color',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    // Create indexes using raw SQL
    await queryRunner.query(`
      CREATE INDEX IDX_WISHLIST_USER_TYPE ON wishlist_item (user_id, item_type)
    `);

    await queryRunner.query(`
      CREATE INDEX IDX_WISHLIST_ADDED_AT ON wishlist_item (added_at)
    `);

    // Unique constraint for product items
    await queryRunner.query(`
      CREATE UNIQUE INDEX IDX_WISHLIST_USER_PRODUCT_UNIQUE 
      ON wishlist_item (user_id, product_id, selected_color_id, deleted_at)
    `);

    // Unique constraint for lens items
    await queryRunner.query(`
      CREATE UNIQUE INDEX IDX_WISHLIST_USER_LENS_UNIQUE 
      ON wishlist_item (user_id, lens_id, deleted_at)
    `);

    // Add check constraint
    await queryRunner.query(`
      ALTER TABLE wishlist_item ADD CONSTRAINT CHK_WISHLIST_ITEM_TYPE 
      CHECK (
        (item_type = 'product' AND product_id IS NOT NULL AND lens_id IS NULL) OR
        (item_type = 'lens' AND lens_id IS NOT NULL AND product_id IS NULL)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('wishlist_item');
  }
}
