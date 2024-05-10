

interface Props {
    section_title: string;
    section_content_html: string;
}






  
const CompletedPageContent: React.FC<Props> = (props) => {
    // Define your component logic here 
   
    
    return (
      
        <div className='mx-4 mb-5 '>
            <div className='w-full flex justify-start py-2'>
                <h2 className='bg-gradient-to-br from-primary to-secondary bg-clip-text w-fit text-transparent text-2xl font-bold ml-2'>{props.section_title}</h2>
            </div>
            <div className="w-full flex justify-start ml-2 pr-4 mt-4" dangerouslySetInnerHTML={{__html:props.section_content_html!}}>
                {/* <p className="text-base font-roboto sm:text-lg leading-7 sm:leading-8">{section_content}</p> */}
            </div>
        </div>
    );
};

export default CompletedPageContent;