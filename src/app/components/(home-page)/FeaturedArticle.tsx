import { Card } from "@/components/ui/card";
import prisma from "@/lib/db";
import Link from "next/link";

interface Props {

}

type SimpleMeanings ={
    articleId: number;
    meaning: string;
    sectionTitle: string;
    articleTitle: string;
}

async function getFeaturedArticle() {
    const randomArticle = await prisma.$queryRaw`SELECT * FROM SimpleMeanings ORDER BY RAND() LIMIT 1` as SimpleMeanings[];

    return randomArticle[0];
}


const FeaturedArticle: React.FC<Props> = async ({}) => {
    const featured_article = await getFeaturedArticle();
    return (

        <div className="w-full sm:px-4 mb-20 ">
            
            <div className="text-3xl text-center text-black mb-8"> {'Featured Article'}</div>
            
            <Card className="mt-4 p-4 sm:p-8 border border-black text-white rounded-lg shadow-md flex flex-col items-center justify-center">
                <Link href={`/pages/${featured_article.articleTitle.split(" ").join("-")}?page=${featured_article.articleId}`} className="flex flex-col items-center justify-center">
                    <h3 className="bg-gradient-to-br from-primary to-secondary bg-clip-text w-fit pb-1 text-3xl font-bold text-transparent">{featured_article.articleTitle + ":"}</h3>
                    <h2 className="bg-gradient-to-br from-primary to-secondary bg-clip-text w-fit pb-1 text-2xl font-bold text-transparent">{featured_article.sectionTitle}</h2>
                </Link>
             
                <p className="mt-10 sm:leading-loose sm:text-lg list-disc list-inside sm:px-5 mb-4">
                    {featured_article.meaning} 
                </p>
              
            </Card>

          </div>
   
    );
}

export default FeaturedArticle;