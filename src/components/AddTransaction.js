import React, {useState, useContext} from 'react'
import { GlobalContext } from '../context/GlobalState';

export const AddTransaction = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const { addTransaction } = useContext(GlobalContext);

  const onSubmit = e => {
    e.preventDefault();
    if (!text || !amount) return;
    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: +amount,
      date
    };
    addTransaction(newTransaction);
    setText('');
    setAmount(0);
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <>
      <h3>Add new transaction</h3>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="text">Description</label>
          <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Enter description..." />
        </div>
        <div className="form-control">
          <label htmlFor="amount">Amount <br />(negative - expense, positive - income)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount..." />
        </div>
        <div className="form-control">
          <label htmlFor="date">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <button className="btn">Add transaction</button>
      </form>
    </>
  )
}
