'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "@/libs/firebase";
import { toast } from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [stateId, setStateId] = useState(null);
  const [stateName, setStateName] = useState("");
  const [cityId, setCityId] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tinFileUrl, setTinFileUrl] = useState("");
  const [nationalIdFileUrl, setNationalIdFileUrl] = useState("");

  
  async function handleFormSubmit(ev) {
    ev.preventDefault(); 
    setCreatingUser(true);
    setError(''); 
  
    const formData = new FormData(ev.target);
    const data = Object.fromEntries(formData.entries()); 
  
    if (data.role === 'seller') {
      data.isSeller = true;
    } else {
      data.isSeller = false;
    }
    
    data.stateId = stateId;
    data.stateName = stateName;
    data.cityId = cityId;
    data.cityName = cityName;
    data.fullName = fullName;
    data.password = password;
    data.confirmPassword = confirmPassword;
    data.email = email;
    data.phoneNumber = phoneNumber;
    data.tinNumber = tinFileUrl;
    data.nationalId = nationalIdFileUrl;
    console.log("data: ", data);
  
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      setCreatingUser(false); 
      toast.error('Passwords do not match');
      return;
    }
  
    // Toast for loading
    const toastId = toast.loading("Creating your account...");
  
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify(data), 
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        toast.success("Account created successfully!", { id: toastId });
        router.push('/signin'); 
      } else {
        const result = await response.json();
        const errorMessage = result.error || 'An error occurred. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      }
    } catch (error) {
      setError('Failed to connect to the server. Please try again.');
      toast.error('Failed to connect to the server. Please try again.', { id: toastId });
    } finally {
      setCreatingUser(false);
      toast.dismiss(toastId); 
    }
  }
  
  const handleUpload = async (file, setFileUrl) => {
  
    const uploadPromise = new Promise(async (resolve, reject) => {
      try {
        const fileRef = ref(storage, `merchantFiles/${file.name}`);
        
        const uploadTask = await uploadBytesResumable(fileRef, file);
        
        const downloadUrl = await getDownloadURL(uploadTask.ref);
        console.log("URL: ", downloadUrl);
        setFileUrl(downloadUrl);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  
    // Display toast notifications
    await toast.promise(uploadPromise, {
      loading: "Uploading file...",
      success: "File uploaded successfully!",
      error: "Error uploading file!",
    });
  };

  return (
    <div className="max-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl bg-gray-200 p-6 rounded-lg shadow-lg mt-3  border">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
         {error && (
                <div className="my-4 text-center text-red-500">
                    {error}
                </div>
            )}
        <form onSubmit={handleFormSubmit}>
            <div className="grow grid md:grid-cols-2 sm:grid-cols-1 gap-5">
                <div className="">
                    <div className="mb-2">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                        </label>
                        <input
                        type="text"
                        id="fullName"
                        onChange={ev => setFullName(ev.target.value)}
                        placeholder="Enter your full name"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                        </label>
                        <input
                        type="email"
                        id="email"
                        onChange={ev => {setEmail(ev.target.value)}}
                        placeholder="Enter your email"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                        </label>
                        <input
                        type="password"
                        id="password"
                        onChange={ev => setPassword(ev.target.value)}
                        placeholder="Enter a strong password"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                        </label>
                        <input
                        onChange={ev => setConfirmPassword(ev.target.value)} 
                        type="password"
                        id="confirmPassword"
                        placeholder="Re-Enter password"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                        />
                    </div>
                </div>
                <div className="">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Sign Up As</label>
                        <div className="flex items-center space-x-4 mt-2">
                        <label className="flex items-center">
                            <input
                            type="radio"
                            name="role"
                            value="Seller"
                            onChange={() => setRole("Seller")}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2">Seller</span>
                        </label>
                        <label className="flex items-center">
                            <input
                            type="radio"
                            name="role"
                            value="Buyer"
                            onChange={() => setRole("Buyer")}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2">Buyer</span>
                        </label>
                        </div>
                        {role === "Seller" && (
                            <div className="mt-3">
                                <div className="mb-4">
                                    <label htmlFor="tinNumber" className="block text-sm font-medium text-gray-700">
                                    TIN Number
                                    </label>
                                    <input
                                    type="file"
                                    id="tinNumber"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={(e) => handleUpload(e.target.files[0], setTinFileUrl)}
                                    required
                                    />
                                    {tinFileUrl && (
                                    <p className="text-sm text-green-500 mt-2">File uploaded successfully!</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
                                    National ID
                                    </label>
                                    <input
                                    type="file"
                                    id="nationalId"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={(e) => handleUpload(e.target.files[0], setNationalIdFileUrl)}
                                    required
                                    />
                                    {nationalIdFileUrl && (
                                    <p className="text-sm text-green-500 mt-2">File uploaded successfully!</p>
                                    )}
                                </div>
                            </div>
                        )}
                    <div className="mb-4">
                        <div className="mb-2 mt-5">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Phone Number
                            </label>
                            <input
                            type="number"
                            onChange={ev => setPhoneNumber(ev.target.value)}
                            id="phoneNumber"
                            placeholder="Enter Phone Number"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                            />
                        </div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex gap-3 items-center mt-2">
                          <StateSelect
                              defaultValue={stateId ? { id: stateId, name: stateName } : 0}
                              countryid={70}
                              onChange={(e) => {
                              setStateId(e.id);
                              setStateName(e.name);
                              }}
                              placeHolder="Select Region"
                          />
                        </div>
                        <div className="flex gap-3 items-center mt-2">
                          <CitySelect
                              defaultValue={cityId ? { id: cityId, name: cityName } : 0}
                              countryid={70}
                              stateid={stateId}
                              onChange={(e) => {
                              setCityId(e.id);
                              setCityName(e.name);
                              }}
                              placeHolder="Select City"
                          />
                        </div>
                      </div>
                    </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-6">
                <button
                    type="submit"
                    className="w-1/3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={creatingUser}
                >
                    Sign Up
                </button>
            </div>
         <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Already have an account? <a href="/signin" className="text-blue-600 hover:text-blue-800">Sign In</a></p>
         </div>
        </form>
      </div>
    </div>
  );
}
