export function findPrimaryCategory(categories) {
    for(let i = 0; i < categories?.length; i++) {
        if(categories[i]?.isPrimary === true){
            return categories[i]?.node?.name
        }
    }
}

export function trimTextToMaxChar(intro: string, MAXCHARS: number) {
    //get first (max_char - 20) of text and ending on word and append "..."
    let introText = intro?.replace( /(<([^>]+)>)/ig, '')
    
    if(introText?.length > MAXCHARS) { 
        //max chars to ensure we don't cut of ending word
        introText = introText.substring(0, MAXCHARS - 3) + "..."
    }

    return introText
}