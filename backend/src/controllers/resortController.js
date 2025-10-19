import Resort from '../models/resortModel.js';
import File from '../models/fileModel.js';
import fs from 'fs';
import path from 'path';

export const getAllResorts = async (req, res) => {
  try {
    const resorts = await Resort.find().sort({ createdAt: -1 });
    res.json(resorts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const createResort = async (req, res) => {
  try {
    const { name, description, price, location } = req.body;
    const newResort = new Resort({ name, description, price, location });
    await newResort.save();
    res.json(newResort);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getResortById = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    if (!resort) return res.status(404).json({ msg: 'Not found' });
    res.json(resort);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const updateResort = async (req, res) => {
  try {
    const { name, description, price, location } = req.body;
    const updated = await Resort.findByIdAndUpdate(
      req.params.id,
      { name, description, price, location },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const deleteResort = async (req, res) => {
  try {
    await Resort.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
