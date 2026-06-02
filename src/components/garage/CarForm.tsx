import { FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CAR_NAME_MAX_LENGTH, MAX_CARS } from '../../utils/constants';
import { carNameExists } from '../../api/client';
import {
  setCreateName,
  setCreateColor,
  setEditName,
  setEditColor,
  clearEdit,
  addCar,
  editCar,
  fetchCars,
} from '../../store/garageSlice';
import styles from './CarForm.module.css';

function CarForm() {
  const dispatch = useAppDispatch();
  const { createName, createColor, editId, editName, editColor, currentPage, totalCount } =
    useAppSelector((s) => s.garage);
  const [nameError, setNameError] = useState('');

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    if (await carNameExists(createName.trim())) {
      setNameError('A car with this name already exists');
      return;
    }
    setNameError('');
    await dispatch(addCar({ name: createName.trim(), color: createColor }));
    dispatch(setCreateName(''));
    dispatch(setCreateColor('#000000'));
    dispatch(fetchCars(currentPage));
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editId || !editName.trim()) return;
    await dispatch(editCar({ id: editId, name: editName.trim(), color: editColor }));
    dispatch(clearEdit());
    dispatch(fetchCars(currentPage));
  };

  return (
    <div className={styles.forms}>
      <form className={styles.form} onSubmit={handleCreate}>
        <div className={styles.inputWrap}>
          <input
            className={`${styles.input}${nameError ? ` ${styles.inputError}` : ''}`}
            value={createName}
            onChange={(e) => { dispatch(setCreateName(e.target.value)); setNameError(''); }}
            placeholder="Car name"
            maxLength={CAR_NAME_MAX_LENGTH}
          />
          {nameError && <span className={styles.error}>{nameError}</span>}
        </div>
        <input
          type="color"
          className={styles.colorPicker}
          value={createColor}
          onChange={(e) => dispatch(setCreateColor(e.target.value))}
        />
        <button className={styles.btn} type="submit" disabled={!createName.trim() || totalCount >= MAX_CARS}>
          CREATE
        </button>
      </form>

      <form className={styles.form} onSubmit={handleUpdate}>
        <input
          className={styles.input}
          value={editName}
          onChange={(e) => dispatch(setEditName(e.target.value))}
          placeholder="Select a car"
          maxLength={CAR_NAME_MAX_LENGTH}
          disabled={!editId}
        />
        <input
          type="color"
          className={styles.colorPicker}
          value={editColor}
          onChange={(e) => dispatch(setEditColor(e.target.value))}
          disabled={!editId}
        />
        <button className={styles.btn} type="submit" disabled={!editId || !editName.trim()}>
          UPDATE
        </button>
      </form>
    </div>
  );
}

export default CarForm;
