import React, { useState } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteUser } from "@/lib/actions/auth.action";

const DeleteUserCard = ({ user }: any) => {
  const [visible, setVisible] = useState(true);

  const handleEliminar = async (id: string) => {
    const res = await deleteUser(id);
    if (res.ok) {
        setVisible(false)
      toast.success("Usuario eliminado correctamente.");
    } else {
      toast.error("Error al eliminar el usuario.");
    }
  };
  if (!visible) return null;
  return (
    <>
      <Card key={user.id} className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="font-bold">{user.name || "Sin nombre"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-1">
            <strong>Correo:</strong> {user.email}
          </p>
          <p className="text-sm text-gray-700 mb-3">
            <strong>Rol:</strong>{" "}
            {user.role === "admin" ? "Administrador" : "Estudiante"}
          </p>
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            onClick={() =>
              toast.warning("Eliminar Usuario", {
                description:
                  "¿Desea eliminar este usuario? Esta acción no es reversible.",
                action: {
                  label: "Confirmar",
                  onClick: () => handleEliminar(user.id),
                },
              })
            }
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default DeleteUserCard;
