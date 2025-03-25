import { createContext } from "react"

export const AppContext = createContext(null)

const AppContextProvider = (props) => {

const currency = "$"

  const calculateAge = (dob) => {
    const today = new Date()
    const birthDate = new Date(dob)
    
    let age = today.getFullYear() - birthDate.getFullYear()
    
    // Check if birthday hasn't occurred yet this year
    const todayMonth = today.getMonth()
    const birthMonth = birthDate.getMonth()
    
    if (birthMonth > todayMonth || (birthMonth === todayMonth && birthDate.getDate() > today.getDate())) {
      age--
    }
    
    return age
  }
  
  const months = [
    "",
    "January ",
    "February ",
    "March ",
    "April ",
    "May ",
    "June ",
    "July ",
    "August ",
    "September ",
    "October ",
    "November ",
    "December "
  ];
  
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_")
    return dateArray[0] + "" + months[Number(dateArray[1])] + "" + dateArray[2]
  }
  
  const value = {
    calculateAge,
    slotDateFormat, currency
  }
  
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider