-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "visual_score" INTEGER NOT NULL,
    "auditory_score" INTEGER NOT NULL,
    "reader_score" INTEGER NOT NULL,
    "answers" TEXT NOT NULL,
    "learner_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
