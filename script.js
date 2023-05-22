const DOCTYPE = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`
const DOWNLOAD_ARROW = `<svg xmlns="http://www.w3.org/2000/svg" width="2em" viewBox="0 96 960 960">
    <path style="fill:#fff" d="M220 896q-24 0-42-18t-18-42V693h60v143h520V693h60v143q0 24-18 42t-42 18H220Zm260-153L287 550l43-43 120 120V256h60v371l120-120 43 43-193 193Z"/>
    </svg>`
const dropzone = document.querySelector('#dropzone')
let parsedString = ''
let bookmarks = 0
let folders = 0

function createDownloadable(string, lastModified) {
    const fileName = lastModified.toLocaleDateString([],{day:'2-digit', month:'2-digit',year:'2-digit'})
    const time = lastModified.toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})
    const downloadable = document.createElement('div')
    const count = document.createElement('span')
    const modified = document.createElement('span')
    const a = document.createElement('a')
    downloadable.classList.add('downloadable')
    a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(string)
    a.download = 'bookmarks_' + fileName + '.HTML'
    count.innerText = `Found ${folders} folders\nand ${bookmarks} bookmarks`
    modified.innerText = 'Last modified\n' + fileName + ' ' + time
    downloadable.appendChild(modified)
    downloadable.appendChild(count)
    downloadable.appendChild(a)
    a.innerHTML = DOWNLOAD_ARROW
    document.querySelector('.downloads').appendChild(downloadable)
}

function parseBookmarks (object) {
    if (object.type === 'url') {
        bookmarks++
        parsedString += `<DT><A HREF="${object.url}" ADD_DATE="${Math.floor((object.date_added / 1000000) - 11644473600)}">${object.name}</A>\n`
    } else if (object.type === 'folder') {
        folders++
        parsedString += `<DT><H3 ADD_DATE="${Math.floor((object.date_added / 1000000) - 11644473600)}" LAST_MODIFIED="${Math.floor((object.date_modified / 1000000) - 11644473600)}"` +
            `${object.name === 'Bookmarks bar' ? `PERSONAL_TOOLBAR_FOLDER="true"` : ''}>${object.name}</H3>\n<DL><p>\n`
        object.children.forEach(parseBookmarks)
    }
    if (object.type === 'folder') parsedString += `</DL><p>\n`
}

function processFiles(files) {
    for (let i = 0; i < files.length; i++) {
        let lastModified = new Date (files[i].lastModified)
        files[i].text().then(text => {
            const roots = JSON.parse(text).roots
            Object.keys(roots).forEach(i => parseBookmarks(roots[i]))
            // parseBookmarks(JSON.parse(text).roots)
            createDownloadable(DOCTYPE + parsedString + `</DL><p>`, lastModified)
            parsedString = ''
            bookmarks = 0
            folders = 0
        }).catch((err) => console.log(err))
    }
}

dropzone.addEventListener('drop', e => {
    e.preventDefault()
    dropzone.classList.remove('dragingOver')
    processFiles(e.dataTransfer.files)
})
dropzone.addEventListener('dragover', e => {
    e.preventDefault()
    dropzone.classList.add('dragingOver')
})
dropzone.addEventListener('dragleave', e => {
    e.preventDefault()
    dropzone.classList.remove('dragingOver')
})
document.querySelector('#file').addEventListener('change', e => {
    processFiles(e.target.files)
})