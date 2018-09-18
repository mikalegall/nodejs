import React from 'react';
import Henkilo from './components/Henkilo'
// import LisaysLomake from './components/LisaysLomake'
// import axios from 'axios'
import luettelointiPalvelu from './services/puhelinluettelointi'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
                  henkilot: [],
                  uusiNimi: '',
                  uusiNumero: '',
                  rajaus: ''
                 }
  }



  componentWillMount() {
    console.log('Elinkaarimetodi "componentWillMount" suoritettiin')
    // axios
      // .get('http://localhost:3001/persons')
      // .then(response => {
        // console.log('axios.get.foobar.then.response.data = ', response.data)
        // console.log('Promise muuttunut fulfilled tilaan ja setState-metodia tökkäisty eli käsketty renderöimään')
        // this.setState({ henkilot: response.data })
      // })
      luettelointiPalvelu
      .getAll()
      .then(response => {
          console.log('Promise muuttunut fulfilled tilaan ja setState-metodia tökkäisty eli käsketty renderöimään')      
        this.setState({ henkilot: response.data })
      })
  }


  
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
kasitteleMuutosNimi = (event) => {
    // event.target vastaa kontrolloidun syötekomponentin input-kenttää
      //  event.target.value vastaa kontrolloidun syötekomponentin kentän arvoa
        console.log('kasitteleMuutosNimi --> event.target.value on: ', event.target.value)
          this.setState({ uusiNimi: event.target.value })
  }
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
kasitteleMuutosNumero = (event) => {
  // event.target vastaa kontrolloidun syötekomponentin input-kenttää
    //  event.target.value vastaa kontrolloidun syötekomponentin kentän arvoa
      console.log('kasitteleMuutosNumero --> event.target.value on: ', event.target.value)
        this.setState({ uusiNumero: event.target.value })
}
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



// ***********************************************************************************************************
  // Lomakkeen kentän kautta vastaanotetaan muutos, joka halutaan tallentaa
  lisaaMuutos = (event) => {
    event.preventDefault()
        console.log('this.state.uusiNimi = ', this.state.uusiNimi, 'this.state.uusiNumero = ', this.state.uusiNumero)

        let apumuuttuja = false
          for (let i = 0; i < this.state.henkilot.length; i++) {
            if (this.state.henkilot[i].nimi === this.state.uusiNimi) {
                apumuuttuja = true;
                break;
            }
        }

      console.log('apumuuttuja = ', apumuuttuja)

      if (apumuuttuja) {
            window.alert('Henkilö on jo tallennettu')
            this.setState({ // Lopulta komponentin Tila (state) päivitetään
              ...this.state.henkilot, // kopioimalla olemassa olevat henkilöt
              uusiNimi: '',   // ja tyhjentämällä kontrolloidun syötekomponentin nimi-kenttä
              uusiNumero: ''  // sekä tyhjentämällä kontrolloidun syötekomponentin numero-kenttä
            })
      } else {
              const olioJSON = {
              nimi: this.state.uusiNimi,
              numero: this.state.uusiNumero
              }

// const henkilot = this.state.henkilot.concat(olioJSON)
              luettelointiPalvelu
              .create(olioJSON)
          // axios
              // .post('http://localhost:3001/notes', muistiinpanoJSON)
              .then(
                response =>
                  {
                      console.log("Lisää muistiinpano -toiminnon form-tägi eli REST/put-toiminto: axios:in 'response' = ", response)
                      this.setState({ // Lopulta komponentin Tila (state) päivitetään
                        henkilot: this.state.henkilot.concat(response), // uudella muistiinpanolla ja
                        uusiNimi: '', // tyhjennetään kontrolloidun syötekomponentin kenttä
                        uusiNumero: '',
                        rajaus: ''
                      // Yllä oleva Tilan päivittäminen aiheuttaa renderöinnin, jolloin juuri lisätty uusi muistiinpano
                      // saadaan myös ruudulle näkyviin 'componentDidMount()' avulla, joka aiheuttaa taas uudelleen renderöinnin :)
                      })
                  }
              )
        }
}
/*
      this.setState({ // Lopulta komponentin Tila (state) päivitetään
        henkilot, // uudella henkilöllä ja
        uusiNimi: '',   // ja tyhjentämällä kontrolloidun syötekomponentin nimi-kenttä
        uusiNumero: ''  // sekä tyhjentämällä kontrolloidun syötekomponentin numero-kenttä
      })
    }
}*/
// ***********************************************************************************************************
  





// ***********************************************************************************************************
  // Lomakkeen kentän kautta vastaanotetaan muutos eli tieto siitä mitä halutaan poistaa
  kasittelePoistaminen = (event) => {
      luettelointiPalvelu
      .deleteObj(event)
      .then(
        response =>
          {
 
                luettelointiPalvelu
                .getAll()
                .then(response => {   
                  this.setState({ henkilot: response.data })
                })

				  }
      )
      .catch(virheilmoitus => { // Mikäli promise menee tilaan "response_resolve_result_rejected" käsitellään virheilmoitus 
            // TODO: Käsittele virheilmoitus jollain tavalla
            alert(`Poistettavan olion (ID:llä '${event.id}') poistaminen epäonnistui, koska `, virheilmoitus)
        this.setState({ notes: this.state.henkilot }) // Tökätään renderiä setState-metodin kautta
      })
  }
// ***********************************************************************************************************



render() {
  console.log('Käytiin renderissä')

    return (
      <div>


        <h2>Puhelinluettelo</h2>
      { /* <LisaysLomake props={this.state} /> */ }

        <h2> Lisää uusi</h2>
        <form onSubmit={this.lisaaMuutos}>
          <div>
            nimi:
            <input 
            value={this.state.uusiNimi} 
            // Tapahtumankäsittelijää kutsutaan aina kun syötekomponentissa tapahtuu jotain 
            onChange={this.kasitteleMuutosNimi}
          />
          </div>
          
          
          <div>
            numero:
            <input 
            value={this.state.uusiNumero} 
            // Tapahtumankäsittelijää kutsutaan aina kun syötekomponentissa tapahtuu jotain 
            onChange={this.kasitteleMuutosNumero}
          />
          </div>
          
          
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>


        <h2>Numerot</h2>

          { this.state.henkilot.map(
              hlo =>
                <Henkilo key={hlo.id} props={hlo} handleClick={this.kasittelePoistaminen} />  // Tässä annetaan CallBack toiminto "handleClick"
            )
          }

      </div>
    )
  }
}

export default App