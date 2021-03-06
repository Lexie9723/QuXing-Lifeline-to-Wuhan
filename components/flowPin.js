function showPin(x, y, index, content, func) {
    console.log(123)
    let pin = $(`#flowPin_${index}`)
    let action = ()=>{
        pin.css('opacity', 0).css('display', '').css('transform', `translate(${x}px, ${y}px)`)
        if(content != null){
            Object.keys(content).forEach(key=>{
                $(`#flowPin_${index}_${key}`).text(content[key])
            })
        }
        func&&func(pin)
        pin.animate({opacity: 1})
    }
    if (pin.css('opacity') === 1 || pin.css('opacity') === '1') {
        pin.animate({opacity: 0}, null, ()=>{
            action()
        })
    } else {
        action()
    }
}

let leaving = false
function hidePin(index, func) {
    if(leaving) return false
    let pin = $(`#flowPin_${index}`)
    if(func) {
        func(pin)
    }
    if (pin.css('opacity') === 1 || pin.css('opacity') === '1' && !leaving) {
        leaving = true
        pin.animate({opacity: 0}, null, ()=>{
            pin.css('display', 'none')
            leaving = false
        })
        return true
    }
    return false
}

let guide_focus
function showGuideNP(isDown, showCallback, clickCallback, isBlue) {
    if(guide_focus != null) {
        return
    }
    if(isBlue) {
        guide_focus = d3.select('#guide_blue')
    } else {
        guide_focus = d3.select('#guide_white')
    }
    let rotate = `rotate(${isDown ? 0 : 180}deg)`
    guide_focus.style('transform', rotate)
        .style('top', `${isDown ? 980:52}px`)
        .style('display', null)
        .transition().duration(1000)
        .attr('opacity', 1)
        .on('end', ()=>{
            let guide = guide_focus;
            (function anima(){
                if(guide === guide_focus) {
                    guide.transition().duration(1000).ease(d3.easeCubicIn)
                        .style('transform', `translate(0px, ${isDown? 20:-20}px)${rotate}`)
                        .on('end', ()=>{
                            guide.transition().duration(1000).ease(d3.easeCubicOut)
                                .style('transform', `translate(0px, 0px)${rotate}`)
                                .on('end', ()=>anima())
                        })
                }
            })();
            showCallback&&showCallback();
        })
    guide_focus.on('click', ()=>{
        clickCallback&&clickCallback()
        hideGuideNP()
    })
}

function hideGuideNP() {
    if(guide_focus != null) {
        let guide = guide_focus
        guide_focus = null
        console.log('eeeee')
        guide.on('click', null)
        guide.transition().duration(1000)
            .attr('opacity', 0)
            .on('end', ()=>{
                guide.style('display', 'none')
            })
    }
}

let guideS
let guideS_Callback
function showGuideS(isDown, callback, y, text){
    let guide = d3.select('#guide_scroll')
    if(guide.style('display') !== 'none') return
    let icon = guide.select('g')
    let Y = y? y : 0
    guideS_Callback = callback
    guide.select('text').text(text? text : isDown? 'Scroll Down':'Scroll Up')
    guide.style('display', null).style('top', `${Y}px`)
        .transition().duration(1000)
        .attr('opacity', 1)
        .on('end', ()=>{
            guideS = guide;
            (function anima(){
                if (guideS === null) return
                icon.transition().duration(1000).ease(d3.easeCubicIn)
                    .attr('transform', `translate(0 ${isDown? 20:-20})`)
                    .on('end', ()=>{
                        icon.transition().duration(1000).ease(d3.easeCubicOut)
                            .attr('transform', `translate(0 0)`)

                    })
            })()
        })
}

let guideH = -1
function changeNavbar(index) {
    let nb = d3.select('#nb_bar')
    nb.selectAll('path')
        .each(function(d){
            let path = d3.select(this)
            let y = 5 + d * 70;
            path.transition().duration(1000)
                .attr('fill', (d === index || d - 1 === index) ? (index === 4 ? 'url(#nbl2)': 'url(#nbl)') : index === 4? '#13344F':'white')
                .attr('d', (d === index || d - 1 === index) ?
                    `M0 ${y + 2}L80 ${y}L80 ${y}L0 ${y - 2}Z` :
                    `M0 ${y + 1}L30 ${y + 1}L30 ${y - 1}L0 ${y -1}Z`)
        })

    nb.selectAll('text')
        .each(function(d, i){
            let text = d3.select(this)
            text.transition().duration(1000)
                .attr('fill', index === 4 ? '#13344F':'white')
                .attr('font-weight', (i === index) ? 'bold':null)
                .attr('font-size', (i === index)? 22:16)
        })
    let nh = d3.select('#nb_help')
    let nc = d3.select('#nb_card')
    if(index === 4) {
        nh.select('circle').transition().duration(1000).attr('stroke', '#13344F')
        nh.select('path').transition().duration(1000).attr('fill', '#13344F')
        nh.selectAll('stop').transition().duration(1000).attr('stop-color', '#13344F')

        nc.select('circle').transition().duration(1000).attr('stroke', '#13344F')
        nc.select('path').transition().duration(1000).attr('fill', '#13344F')
        nc.selectAll('stop').transition().duration(1000).attr('stop-color', '#13344F')
    } else {
        nh.select('circle').transition().duration(1000).attr('stroke', 'white')
        nh.select('path').transition().duration(1000).attr('fill', 'white')
        nh.selectAll('stop').transition().duration(1000).attr('stop-color', 'white')

        nc.select('circle').transition().duration(1000).attr('stroke', 'white')
        nc.select('path').transition().duration(1000).attr('fill', 'white')
        nc.selectAll('stop').transition().duration(1000).attr('stop-color', 'white')
    }
}

function hideGuide(guide, callback){
    if(d3.active(guide.node(), 'in') === null && d3.active(guide.node(), 'out') === null) {
        guide.transition('out').duration(1000)
            .attr('opacity', 0)
            .on('end',()=>{
                guide.style('display', 'none')
                guide.on('click', null)
                guide.on(wheelEvent, null)
                guide.on('touchstart', null)
                console.log('out')
                callback&&callback()
            })
    }
}

function showGuide(i){
    let guide = d3.select(`#guide_${i}`)
    guide.style('display', null)
        .on('click',(e)=>{
            e.cancelBubble = true
            hideGuide(guide)
        })
        .on(wheelEvent, (e)=>{
            e.cancelBubble = true
            hideGuide(guide)})
        .on('touchstart', (e)=>{
            e.cancelBubble = true
            hideGuide(guide)
        })
        .transition('in').duration(1000)
        .attr('opacity', 1)
        .on('end', ()=>{
            let icons = guide.selectChild('g');
            (function anima(){
                if('none' !== guide.style('display')){
                    icons.transition().duration(3000).ease(d3.easeCubicIn)
                        .attr('opacity', 0.3)
                        .on('end',()=>{
                            icons.transition().duration(3000).ease(d3.easeCubicOut)
                                .attr('opacity', 1)
                                .on('end',()=>anima())
                        })
                }
            })()
        })
}

function showCard(i, callback){
    let gc = d3.select(`#guideCard`)
    let cards = gc.selectChild('g').selectChildren('g').nodes()
    for (let j = 0; j < cards.length; j++) {
        d3.select(cards[j]).attr('visibility', i === j ? 'visible' : 'hidden')
    }
    gc.style('display', null)
        .on('click',(e)=>{
            e.cancelBubble = true
            hideGuide(gc, callback)
        })
        .on(wheelEvent, (e)=>{
            e.cancelBubble = true
            hideGuide(gc, callback)})
        .on('touchstart', (e)=>{
            e.cancelBubble = true
            hideGuide(gc, callback)
        })
        .transition('in').duration(2500)
        .attr('opacity', 1)
}

$(document).ready(function () {
    registerScroll(document, (e,isDown)=>{
        if(guideS != null) {
            let guide = guideS
            guideS = null
            guideS_Callback&&guideS_Callback(isDown)
            guideS_Callback = null
            guide.transition().duration(1000)
                .attr('opacity', 0)
                .on('end', ()=>{
                    guide.style('display', 'none')
                })
        }
    }, 20)

    //navbar
    let data = ['Division', 'Wishes', 'Forming', 'Unity', 'Bridges']
    let nb = d3.select('#nb_bar')
    nb.selectAll()
        .data([0,1,2,3,4,5])
        .join('path')
        .attr('d', d=>{
            let y = 5 + d * 70;
            return `M0 ${y + 1}L30 ${y + 1}L30 ${y - 1}L0 ${y -1}Z`
        })
        .attr('fill', 'white')

    nb.append('g')
        .attr('dominant-baseline', 'middle')
        .selectAll()
        .data([0,1,2,3,4])
        .join('text')
        .attr('fill', 'white')
        .attr('x', 7)
        .attr('y', (d) => 40 + d * 70)
        .attr('opacity', 0.5)
        .attr('font-size', 15)
        .text(d=>data[d])
        .on('click', (e, d)=>{
            scrollTo(d)
        })

    let nh = d3.select('#nb_help')
        .on('mouseover',()=>nh.transition().attr('opacity', 1))
        .on('mouseleave',()=>nh.transition().attr('opacity', 0.6))
        .on('click', ()=>{
            showGuide(Page)
        })

    let nc = d3.select('#nb_card')
        .on('mouseover',()=>nc.transition().attr('opacity', 1))
        .on('mouseleave',()=>nc.transition().attr('opacity', 0.6))
        .on('click', ()=>{
            showCard(Page)
        })

    changeNavbar(0)
    progressLoaded('Cards Component')
})