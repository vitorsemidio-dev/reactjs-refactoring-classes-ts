import { useEffect, useState } from "react";

import Food, { FoodType } from "../../components/Food";
import Header from "../../components/Header";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import api from "../../services/api";
import { FoodsContainer } from "./styles";

const Dashboard = () => {
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = useState<FoodType>({} as FoodType);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadFoods = async () => {
      const { data } = await api.get<FoodType[]>("/foods");
      setFoods(data);
    };
    loadFoods();
  }, []);

  const handleAddFood = async (food: FoodType) => {
    try {
      const { data: foodAdded } = await api.post("/foods", {
        ...food,
        available: true,
      });
      setFoods([...foods, foodAdded]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FoodType) => {
    try {
      const { data: foodUpdated } = await api.put<FoodType>(
        `/foods/${editingFood.id}`,
        {
          ...editingFood,
          ...food,
        },
      );

      const foodsUpdated = foods.map((food) => {
        if (food.id === editingFood.id) {
          return {
            ...foodUpdated,
          };
        }
        return food;
      });

      setFoods(foodsUpdated);
      toggleEditModal();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: string) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);
    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setModalOpen((state) => !state);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: FoodType) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
