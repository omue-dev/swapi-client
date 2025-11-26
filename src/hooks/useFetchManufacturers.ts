import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Manufacturer } from '../interfaces/types';

const mapResponseToManufacturers = (data: any): Manufacturer[] => {
  if (!data || !data.data) {
    console.error('Invalid data format:', data);
    return [];
  }

  return data.data
    .map((item: any) => ({
      id: item.id,
      name: item.attributes.name,
    }))
    .sort((a: Manufacturer, b: Manufacturer) => a.name.localeCompare(b.name));
};

const useFetchManufacturers = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await axiosInstance.post('/product-manufacturer');
        const manufacturersData = mapResponseToManufacturers(response.data);
        setManufacturers(manufacturersData);
      } catch (err) {
        setError('Error fetching manufacturers');
        console.error('Error fetching manufacturers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturers();
  }, []);

  return { manufacturers, loading, error };
};

export default useFetchManufacturers;
