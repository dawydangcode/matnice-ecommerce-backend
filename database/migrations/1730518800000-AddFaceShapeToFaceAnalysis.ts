import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFaceShapeToFaceAnalysis1730518800000
  implements MigrationInterface
{
  name = 'AddFaceShapeToFaceAnalysis1730518800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`face_analysis\`
      ADD COLUMN \`detected_face_shape_type\` varchar(255) NOT NULL DEFAULT 'oval',
      ADD COLUMN \`face_shape_confidence\` double NOT NULL DEFAULT 0.0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`face_analysis\`
      DROP COLUMN \`detected_face_shape_type\`,
      DROP COLUMN \`face_shape_confidence\`
    `);
  }
}
