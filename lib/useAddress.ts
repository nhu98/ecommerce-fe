'use client';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface City {
  id: string;
  name: string;
  type: number;
  typeText: string;
  slug: string;
}

interface District {
  id: string;
  name: string;
  provinceId: string;
  type: number;
  typeText: string;
}

export const useAddress = (
  localUserCity: string | undefined,
  localUserDistrict: string | undefined,
) => {
  const [loading, setLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const [cityDefault, setCityDefault] = useState('');
  const [districtDefault, setDistrictDefault] = useState('');
  const [wardDefault, setWardDefault] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://open.oapi.vn/location/provinces?page=0&size=100',
        );
        if (!response.ok) {
          toast({
            title: 'Lỗi',
            description: `Lỗi lấy dữ liệu ${response.status}`,
            variant: 'destructive',
            duration: 3000,
          });
        }
        const data = await response.json();
        const cities: City[] = data.data;

        const selectedCity = cities.find((city) => city.name === localUserCity);

        if (selectedCity) {
          await fetchDistricts(selectedCity.id);
          setSelectedCity(selectedCity.id);
        }
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: `Lỗi lấy dữ liệu ${error}`,
          variant: 'destructive',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [localUserCity]);

  const fetchDistricts = async (cityId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://open.oapi.vn/location/districts/${cityId}?page=0&size=100`,
      );
      if (!response.ok) {
        toast({
          title: 'Lỗi',
          description: `Lỗi lấy dữ liệu ${response.status}`,
          variant: 'destructive',
          duration: 3000,
        });
      }
      const data = await response.json();
      const districts: District[] = data.data;

      const selectedDistrict = districts.find(
        (district) => district.name === localUserDistrict,
      );

      if (selectedDistrict) {
        setSelectedDistrict(selectedDistrict.id);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: `Lỗi lấy dữ liệu ${error}`,
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedCity,
    setSelectedCity,
    selectedDistrict,
    setSelectedDistrict,
    cityDefault,
    setCityDefault,
    districtDefault,
    setDistrictDefault,
    wardDefault,
    setWardDefault,
    loading,
  };
};
