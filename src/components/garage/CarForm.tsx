import { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CAR_NAME_MAX_LENGTH } from '../../utils/constants';
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
  const { createName, createColor, editId, editName, editColor, currentPage } =
    useAppSelector((s) => s.garage);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
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
        <input
          className={styles.input}
          value={createName}
          onChange={(e) => dispatch(setCreateName(e.target.value))}
          placeholder="Car name"
          maxLength={CAR_NAME_MAX_LENGTH}
        />
        <input
          type="color"
          className={styles.colorPicker}
          value={createColor}
          onChange={(e) => dispatch(setCreateColor(e.target.value))}
        />
        <button className={styles.btn} type="submit" disabled={!createName.trim()}>
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
