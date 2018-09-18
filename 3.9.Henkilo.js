import React from 'react'

const Henkilo = ({ props, handleClick }) => {
console.log('Henkilo / handleClick (eli CallBack-toiminto) = ', handleClick)

  return (
  
      <div className="tyhjennys">
          {props.nimi} {props.numero} <button type="submit" onClick={ () => handleClick(props.id) } >Poista</button>
                                      {/* Tapahtumankäsittelijällä "onClick" päästään käsiksi ylemmän tason komponentin (parent)
                                          funktiometodiin "kasittelePoistaminen()" käyttämällä CallBack-toimintoa
                                          {() => handleClick()} ja välittämällä sen mukana jokin arvo
                                          (tässä tapauksessa se nyt sattuu olemaan "props.id")
                                      */}
      </div>

  )
}

export default Henkilo