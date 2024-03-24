import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import { CiBeerMugFull } from "react-icons/ci";
import { GiGlassShot } from "react-icons/gi";

// Create context for managing drinks data
const DrinkContext = createContext();

// Component for rendering individual drink details
const Drink = ({ id, text, type, percentage, amount, onRemove, onEdit }) => (
  <div key={id} className=''>
    <h2 className='text-2xl'>{text}</h2>
    <p>Type: {type}</p>
    <p>Percentage: {percentage} %</p>
    <p>Amount: {amount} ml</p>
    <div className=''>
      <button className='text-lg font-semibold border rounded-lg px-2 text-center mt-2 bg-gray-800 text-red-500 border-red-500 hover:border-green-500 hover:text-green-500' onClick={() => onRemove(id)}>Remove</button>
      <button className='text-lg font-semibold border rounded-lg px-2 text-center mt-2 bg-gray-800 text-yellow-500 border-yellow-500 hover:border-green-500 hover:text-green-500 ml-4' onClick={() => onEdit(id)}>Edit</button>
    </div>
  </div>
);

// New component to display the list of drinks using useContext
const DrinkList = ({ drinks, setDrinks, editDrink }) => {
  // Function to remove a drink from the list
  const removeDrink = (idToRemove) => {
    setDrinks(prevDrinks => prevDrinks.filter(drink => drink.id !== idToRemove));
  };

  return (
    <div className='grid grid-cols-4 max-w-fit mx-auto gap-8'>
      {drinks.map((drink, i) => (
        <div key={drink.id} className='border-2 bg-gray-700 rounded-lg p-4 border-blue-500 shadow-blue-700 shadow-md'>
          <Drink {...drink} onRemove={removeDrink} onEdit={editDrink} />
        </div>
      ))}
    </div>
  );
};

// Main App component
const App = () => {
  const [drinks, setDrinks] = useState([]); // State to store drinks
  const [inputValue, setInputValue] = useState(''); // State to manage input field value
  const [percentValue, setPercentValue] = useState(''); // State to manage percentage field value
  const [amountValue, setAmountValue] = useState(''); // State to manage amount field value
  const [selectedType, setSelectedType] = useState(''); // State to manage selected drink type
  const [showWarning, setShowWarning] = useState(false); // State to manage showing the warning
  const [editingDrinkId, setEditingDrinkId] = useState(null); // State to store the id of the drink being edited
  const ref = useRef(null); // Reference to the input element

  // Function to handle adding a new drink
  const addDrinkHandler = useCallback(() => {
    // Check if all input fields are filled
    if (inputValue.trim() === '' || percentValue.trim() === '' || amountValue.trim() === '') return;

    // Create a new drink object
    const newDrink = {
      id: Math.floor(Math.random() * 1000),
      text: inputValue.trim(),
      type: selectedType || 'Undefined',
      percentage: percentValue.trim(),
      amount: amountValue.trim()
    };

     // Update drinks state with the new drink
    setDrinks(prevDrinks => [...prevDrinks, newDrink]);

    // Clear input fields
    setInputValue('');
    setSelectedType('');
    setPercentValue('');
    setAmountValue('');

    // Focus on the input field
    ref.current.focus();

    // Show warning if the number of drinks reaches certain limit
    if (drinks.length === 9 || drinks.length === 19) {
      setShowWarning(true);
    }
  }, [inputValue, selectedType, percentValue, amountValue, drinks]);

  const editDrink = (id) => {
    setEditingDrinkId(id);
    const drinkToEdit = drinks.find(drink => drink.id === id);
    setInputValue(drinkToEdit.text);
    setSelectedType(drinkToEdit.type);
    setPercentValue(drinkToEdit.percentage);
    setAmountValue(drinkToEdit.amount);
  };

  // Function to save the edited drink
  const saveEdit = () => {
    const editedDrink = {
      id: editingDrinkId,
      text: inputValue.trim(),
      type: selectedType || 'Undefined',
      percentage: percentValue.trim(),
      amount: amountValue.trim()
    };

     // Update the drink in the drinks list
    setDrinks(prevDrinks => prevDrinks.map(drink => (drink.id === editingDrinkId ? editedDrink : drink)));

    // Clear input fields and reset editing state
    setInputValue('');
    setSelectedType('');
    setPercentValue('');
    setAmountValue('');
    setEditingDrinkId(null);
  };

  // Effect to focus on input field when component mounts
  useEffect(() => {
    ref.current.focus();
  }, []);

  // Memoized function to calculate total amount of alcohol drank
  const calculateTotalAlcohol = useMemo(() => {
    let totalAlcohol = 0;
    for (const drink of drinks) {
      const alcoholAmount = (parseFloat(drink.amount) * parseFloat(drink.percentage)) / 100;
      totalAlcohol += alcoholAmount;
    }
    return totalAlcohol.toFixed(2);
  }, [drinks]);

  return (
    <DrinkContext.Provider value={drinks}> {/* Provide drinks data to the context */}
      <div className='bg-indigo-950 w-dvh min-h-dvh max-h-max flex flex-col text-center text-gray-200'>
        <h1 className='text-5xl mt-8 mb-2 font-bold'>My Drink List</h1>
        {/* Conditionally render the warning card */}
        {showWarning && (
          <div className='self-center p-2 my-4 shadow-md rounded-sm shadow-red-900 border-2 border-rose-700 bg-gray-700 max-w-md'>
            <h3 className='text-3xl font-semibold'>Warning!</h3>
            <p className='text-lg my-2'>You had {drinks.length === 10 ? '10' : '20'} drinks already, if you continue drinking it can end up bad!</p>
            <button onClick={() => setShowWarning(false)} className='text-rose-700 mt-2 text-xl '>Continue drinking</button>
          </div>
        )}
        {/* Render the rest of the content only if showWarning is false */}
        {!showWarning && (
          <>
            <div className='my-10 text-2xl font-semibold flex flex-row justify-center items-center gap-2'>
              <span>
                Number of drinks: {drinks.length}
              </span>
              <GiGlassShot />
              <span className='ml-24'>
              Total alcohol consumed: {calculateTotalAlcohol} ml
              </span>
            </div>
            <div className='flex flex-row items-center justify-center mb-8'>
              <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                ref={ref}
                className='mx-2 rounded-md my-2 p-2 border-2 ring-2 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 bg-gray-700 w-60'
                placeholder='Your drink'
              />
              <input
                type='number'
                value={percentValue}
                onChange={(e) => setPercentValue(e.target.value)}
                className='mx-2 rounded-md my-2 p-2 border-2 ring-2 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 bg-gray-700 w-60'
                placeholder='Percentage'
              />
              <input
                type='number'
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.value)}
                className='mx-2 rounded-md my-2 p-2 border-2 ring-2 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 bg-gray-700 w-60'
                placeholder='Amount (ml)'
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className='mx-2 rounded-md my-2 p-2 border-2 ring-2 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 bg-gray-700'
              >
                <option value=''>Select drink type</option>
                <option value='Beer'>Beer</option>
                <option value='Wine'>Wine</option>
                <option value='Whiskey'>Whiskey</option>
                <option value='Vodka'>Vodka</option>
                <option value='Rum'>Rum</option>
                <option value='Coctail'>Cocktail</option>
                <option value='Liquor'>Liquor</option>
              </select>
              {editingDrinkId === null ? (
                <div onClick={addDrinkHandler} className='flex flex-row mx-2 border-2 border-cyan-300 bg-cyan-300 hover:bg-cyan-900 active:bg-slate-800 text-slate-800 hover:text-cyan-300 px-8 py-2 rounded-lg font-semibold items-center justify-center cursor-pointer'>
                  <CiBeerMugFull className='h-6 w-6 mr-2' />
                  <button>Add drink</button>
                </div>
              ) : (
                <div onClick={saveEdit} className='flex flex-row mx-2 border-2 border-green-700 bg-green-400 hover:bg-green-900 active:bg-slate-800 text-slate-800 hover:text-green-300 px-8 py-2 rounded-lg font-semibold items-center justify-center cursor-pointer'>
                  <CiBeerMugFull className='h-6 w-6 mr-2' />
                  <button>Save</button>
                </div>
              )}
            </div>
            {/* Display list of drinks using DrinkList component */}
            <DrinkList drinks={drinks} setDrinks={setDrinks} editDrink={editDrink} />
          </>
        )}
      </div>
    </DrinkContext.Provider>
  );
};

export default App;