import { simplemeaning_prompt } from "@/app/helpers/constants/simplewiki-prompt";
import OpenAI from "openai";
import prisma from "@/lib/db";
import { getEncoding } from "js-tiktoken";

const wiki = require('wikipedia');


const open_ai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
})




interface Props {
    // Define the props for your component here
    page_title: string;
    page_id: number;
    section_title: string;
    section_index: number;
    section_text: string;
}

function Get_Token_Length(input:string) {
    const encoding = getEncoding("cl100k_base");
    const tokens = encoding.encode(input);
    return tokens.length
    
}

async function GetSectionContent(section_title: string, section_text: string, page_id: number) {
    let shorted_text = section_text;
    while (Get_Token_Length(shorted_text) > 10000) {
        shorted_text = shorted_text.slice(0, shorted_text.length - 1);
    }
    const prompt =  "title: " + section_title + "\n" + shorted_text
  
    const completion = await open_ai.chat.completions.create({
        model : "gpt-3.5-turbo-0125",
        messages : [
            {"role": "system", "content": simplemeaning_prompt},
            {"role": "user", "content": prompt},
        ],
        
        temperature : 0.7
      })
  
    return completion.choices[0].message.content
  }

async function PostContentToDB(section_index: number, article_id: number, section_content: string, section_content_html: string, section_title: string, article_title: string) {
    await prisma.simpleMeaning.create({
        data: {
            articleId: article_id,
            index: section_index,
            meaning: section_content,
            meaningHtml: section_content_html,
            sectionTitle: section_title,
            articleTitle: article_title,
        }
    })
}

async function GetContentFromDB(section_index: number, article_id: number) {
    const section_content = await prisma.simpleMeaning.findUnique({
        where: {
            meaning_id: {
                articleId: article_id,
                index: section_index
            }
        }
    })

    return section_content  
}


function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

async function replaceWordsWithLinks(text: string, regex: RegExp) {
    const words = text.split(regex);
    const replacements = new Map();
    const replacedFlags = new Set();
  
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (regex.test(word) && !replacedFlags.has(word)) {
        replacedFlags.add(word);
        if (!replacements.has(word)) {
          try {
            const page = await wiki.page(word);
            const page_id = page.pageid;
            const page_title = page.title;
            const page_slug = page_title.split(" ").join("-").toLowerCase();
            const replacement = `<a class="text-blue-600" href="/pages/${page_slug}?page=${page_id}">${word}</a>`;
            replacements.set(word, replacement);
          } catch (e) {
            console.log(e);
            replacements.set(word, word);
          }
        }
        words[i] = replacements.get(word);
      } else {
        replacements.set(word, word);
      }
    }
  
    return words.join("");
  }



async function boldWords(text: string, words: string[]) {
    // Sort words by length in descending order to prioritize longer matches

    words.sort((a, b) => b.length - a.length);
    

    let regexPattern = words.map(word => escapeRegExp(word)).join('|');
    let regex = new RegExp(`\\b(${regexPattern})\\b`, 'gi');
    
    const replaced_result = await replaceWordsWithLinks(text, regex);
    return replaced_result;
}

async function FormatContentToHTML(content: string, page_id: number) {
    const page = await wiki.page(page_id);
    const links_list = await page.links({namespace: 0});

    const result = await boldWords(content, links_list);
    const line_break_result = result.replace(/\n/g, "<br>");

    return "<p class=\"text-base font-roboto sm:text-lg leading-7 sm:leading-8\">" + line_break_result + "</p>"
}

  
const PageContent: React.FC<Props> = async (props) => {
    // Define your component logic here 

    if (props.section_text.length < 150) {
        return null
    }
    
    const section_from_db = await GetContentFromDB(props.section_index, props.page_id) ;
    let section_content = section_from_db?.meaning;
    
    let section_content_html = section_from_db?.meaningHtml;


    if (section_content == null || section_content_html == null) {
        
        section_content = await GetSectionContent(props.section_title, props.section_text, props.page_id) || "" ;
    
        section_content_html = await FormatContentToHTML(section_content, props.page_id);
       
        if (section_content !== "" && section_content_html !== "" && section_content !== null && section_content_html !== null) {
            try{
                await PostContentToDB(props.section_index, props.page_id, section_content, section_content_html!, props.section_title, props.page_title);
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    console.log(props.section_text)
    return (
      
        <div className='mx-4 mb-5 '>
            <div className='w-full flex justify-start py-2'>
                <h2 className='bg-gradient-to-br from-primary to-secondary bg-clip-text w-fit text-transparent text-2xl font-bold ml-2'>{props.section_title}</h2>
            </div>
            <div className="w-full flex justify-start ml-2 pr-4 mt-4" dangerouslySetInnerHTML={{__html:section_content_html!}}>
                {/* <p className="text-base font-roboto sm:text-lg leading-7 sm:leading-8">{section_content}</p> */}
            </div>
        </div>
    );
};

export default PageContent;