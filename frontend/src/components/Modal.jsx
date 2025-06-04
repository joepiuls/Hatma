import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import { State } from "country-state-city";
import useAuthStore from "../store/useAuthStore";

export const EditModal = ({ isOpen, onClose, onSubmit, defaultValues }) => {
    const {user} = useAuthStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      firstName: `${user?.name.split(" ")[0]}`,
      lastName: `${user?.name.split(" ")[1]}`,
      country: null,
      state: null,
      city: null,
      zipCode: "01111322",
      streetAddress: "Tsohowuar mayanka",
      phoneCode: "+234",
      phoneNumber: `${user?.phoneNumber}`,
      ...defaultValues,
    },
  });

  const selectedCountry = watch("country");
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);


  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((res) => {
      const countries = res.data.map((country) => {
        const root = country.idd?.root || "";
        const suffix = country.idd?.suffixes?.[0] || "";
        return {
          label: country.name.common,
          value: country.cca2,
          phoneCode: root + suffix,
        };
      });

      const sorted = countries
        .filter((c) => c.phoneCode)
        .sort((a, b) => a.label.localeCompare(b.label));
      setCountryOptions(sorted);
    });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setValue("phoneCode", selectedCountry.phoneCode);

      const states = State.getStatesOfCountry(selectedCountry.value).map((s) => ({
        label: s.name,
        value: s.isoCode,
      }));

      setStateOptions(states);
      setValue("state", null);
    }
  }, [selectedCountry, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl w-full max-w-2xl p-6 relative"
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-6">Edit Delivery Address</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input {...register("firstName", { required: true })} className="w-full border rounded p-2" />
            {errors.firstName && <span className="text-red-500 text-sm">First name is required</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input {...register("lastName", { required: true })} className="w-full border rounded p-2" />
            {errors.lastName && <span className="text-red-500 text-sm">Last name is required</span>}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Country</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={countryOptions}
                placeholder="Select country"
                isClearable
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input {...register("city")} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={stateOptions}
                  placeholder="Select state"
                  isClearable
                />
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zip Code</label>
            <input {...register("zipCode")} className="w-full border rounded p-2" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Street Address</label>
          <input {...register("streetAddress", { required: true })} className="w-full border rounded p-2" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Directions (Optional)</label>
          <input {...register("directions")} className="w-full border rounded p-2" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <div className="flex gap-2">
            <input
              className="w-24 border rounded p-2"
              disabled
              {...register("phoneCode")}
            />
            <input
              type="tel"
              {...register("phoneNumber", { required: true })}
              className="flex-1 border rounded p-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
