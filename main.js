const mainH1 = document.getElementById('main-h1')

function navigateTo(url,e){
    if(e.target.nodeName !== 'I' && e.target.nodeName !== 'A')
        window.open(url,'_blank');
}

function paralaxH1(e){
    // console.log(-50 - (e.clientX - window.innerWidth)/100)

    const span1 = mainH1.children[0]
    const span2 = mainH1.children[1]

    span1.style.transform = `translate(${-50 - (e.clientX - window.innerWidth/2)/120}%,${-50 -(e.clientY - window.innerHeight/2)/25}%)`
    span2.style.transform = `translate(${-50 - (e.clientX - window.innerWidth/2)/70}%,${-50 -(e.clientY - window.innerHeight/2)/16}%)`
}