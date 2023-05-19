const doctype = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`
let parsedString = ''

function downloadHTMLFile(text, fileName) {
const element = document.createElement('a');
element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
element.setAttribute('download', fileName);

element.style.display = 'none';
document.body.appendChild(element);

element.click();

document.body.removeChild(element);
}

document.querySelector('#dropzone').addEventListener('drop', (e) => {
    console.log('yo')
    e.target.preventDefault()
    processFile(e)
})

function processFile(e) {
    // e.preventDefault()
    const reader = new FileReader()
    reader.readAsText(e.target.files[0])
    
    reader.onload = () => {
        object = parseBookmarks(JSON.parse(reader.result)
        .roots.bookmark_bar)
        // console.log(doctype + parsedString + `</DL><p>`)
        downloadHTMLFile(doctype + parsedString + `</DL></p>`,'bookmarks.html')
    }
    
    const parseBookmarks = (object) => {
        if (object.type === 'folder') {
            parsedString +=`<DT><H3 ADD_DATE="${Math.floor((object.date_added/1000000)-11644473600)}" LAST_MODIFIED="${Math.floor((object.date_modified/1000000)-11644473600)}"`+
            `${object.name === 'Bookmarks bar'? `PERSONAL_TOOLBAR_FOLDER="true"`:''}>${object.name}</H3>\n<DL><p>\n`
            object.children.forEach(parseBookmarks)
        } else {
        parsedString+=`<DT><A HREF="${object.url}" ADD_DATE="${Math.floor((object.date_added/1000000)-11644473600)}">${object.name}</A>\n`
        }
        if (object.type === 'folder') parsedString+=`</DL></p>\n`
    }
}

document.querySelector('#file').addEventListener('change',processFile)

