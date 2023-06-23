import parser from 'html-react-parser'

export default function Text({text}) {
    
    return (
        <>
        <div className="max-w-2xl mx-auto text-center pb-12">
            {parser(text)}
        </div>
        </>
    )
}