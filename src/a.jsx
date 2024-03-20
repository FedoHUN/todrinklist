import React, { useState, useEffect, useRef, useCallback, useMemo, createContext } from 'react';
import Drink from './Drink';
import DrinkList from './DrinkList';
import Warning from './Warning';
import DrinkForm from './DrinkForm';
import { GiGlassShot } from "react-icons/gi";
import { CiBeerMugFull } from "react-icons/ci";

const DrinkContext = createContext();

const App = () => {
  const [drinks, setDrinks] = useState([]); // State to store drinks
  const [inputValue, setInputValue] = useState(''); // State to manage input field value
  const [percentValue, setPercentValue] = useState(''); // State to manage percentage field value
  const [amountValue, setAmountValue] = useState(''); // State to manage amount field value
  const [selectedType, setSelectedType] = useState(''); // State to manage selected drink type
  const [showWarning, setShowWarning] = useState(false); // State to manage showing the warning
  const [editingDrinkId, setEditingDrinkId] = useState(null); // State to store the id of the drink being edited
  const ref = useRef(null); // Reference to the input element

  useEffect(() => {
    ref.current.focus();
  }, []);

  const addDrinkHandler = useCallback(() => {
    if (inputValue.trim() === '' || percentValue.trim() === '' || amountValue.trim() === '') return;
    const newDrink = {
      id: Math.floor(Math.random() * 1000),
      text: inputValue.trim(),
      type: selectedType || 'Undefined',
      percentage: percentValue.trim(),
      amount: amountValue.trim()
    };
    setDrinks(prevDrinks => [...prevDrinks, newDrink]);
    setInputValue('');
    setSelectedType('');
    setPercentValue('');
    setAmountValue('');

    ref.current.focus();

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

  const saveEdit = () => {
    const editedDrink = {
      id: editingDrinkId,
      text: inputValue.trim(),
      type: selectedType || 'Undefined',
      percentage: percentValue.trim(),
      amount: amountValue.trim()
    };

    setDrinks(prevDrinks => prevDrinks.map(drink => (drink.id === editingDrinkId ? editedDrink : drink)));

    setInputValue('');
    setSelectedType('');
    setPercentValue('');
    setAmountValue('');
    setEditingDrinkId(null);
  };

  useEffect(() => {
    ref.current.focus();
  }, []);

  const calculateTotalAlcohol = useMemo(() => {
    let totalAlcohol = 0;
    for (const drink of drinks) {
      const alcoholAmount = (parseFloat(drink.amount) * parseFloat(drink.percentage)) / 100;
      totalAlcohol += alcoholAmount;
    }
    return totalAlcohol.toFixed(2);
  }, [drinks]);

  return (
    <DrinkContext.Provider value={drinks}>
      <div className='bg-indigo-950 w-dvh min-h-dvh max-h-max flex flex-col text-center text-gray-200'>
        <h1 className='text-5xl mt-8 mb-2 font-bold'>My Drink List</h1>
        <Warning showWarning={showWarning} setShowWarning={setShowWarning} />
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
            <DrinkForm 
              inputValue={inputValue}
              setInputValue={setInputValue}
              percentValue={percentValue}
              setPercentValue={setPercentValue}
              amountValue={amountValue}
              setAmountValue={setAmountValue}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              addDrinkHandler={addDrinkHandler}
              editingDrinkId={editingDrinkId}
            />
            <DrinkList drinks={drinks} setDrinks={setDrinks} editDrink={editDrink} />
          </>
        )}
      </div>
    </DrinkContext.Provider>
  );
};

export default App;
