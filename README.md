# Sistema de Gestión de Pedidos para Restaurantes

Este repositorio contiene el código fuente de un sistema integral de gestión de pedidos diseñado para restaurantes. Es una aplicación web construida con FastAPI, que maneja el ciclo de vida completo de las operaciones de un restaurante, desde la gestión del menú hasta el procesamiento de pedidos y la generación de análisis de ventas.

## Descripción

El sistema permite al personal del restaurante gestionar productos, procesar pedidos de clientes, realizar un seguimiento del flujo de trabajo de la cocina y generar informes de ventas, todo ello a través de una arquitectura de API RESTful. La aplicación se centra en la eficiencia operativa y la facilidad de uso, proporcionando una solución robusta para la administración de restaurantes.

## Características Principales

* **Gestión de Menú:** Administra productos, categorías y precios del menú.
* **Procesamiento de Pedidos:** Maneja la creación, modificación y seguimiento de pedidos de clientes.
* **Flujo de Trabajo de Cocina:** Permite a la cocina visualizar y gestionar los pedidos pendientes.
* **Análisis de Ventas:** Genera informes detallados para la toma de decisiones.
* **API RESTful:** Ofrece una interfaz programable para la integración con otras plataformas.

## Tecnologías Utilizadas

* **FastAPI:** Framework web de alto rendimiento para construir APIs.
* **Pydantic Settings:** Para una gestión de configuración tipada y segura.

## Arquitectura

La aplicación sigue un patrón de enrutadores modular, donde cada dominio de negocio (por ejemplo, productos, pedidos, usuarios) está encapsulado en módulos de ruta separados. La instancia de FastAPI en `main.py` actúa como el punto de entrada principal de la aplicación, orquestando la configuración del middleware y el registro de todos los enrutadores modulares. Esto promueve la escalabilidad y la mantenibilidad del código.

## Flujos de Trabajo de Usuario

El sistema soporta y optimiza tres flujos de trabajo principales para los diferentes roles de usuario:

1.  **Flujo para el Cliente:** Permite a los clientes navegar por el menú, seleccionar productos, añadir al carrito y realizar pedidos.
2.  **Flujo de Trabajo de Cocina:** Proporciona a los cocineros una vista clara de los pedidos entrantes, su estado y las acciones necesarias para prepararlos y marcarlos como completados.
3.  **Flujo Administrativo:** Ofrece a los administradores herramientas para la gestión completa del sistema, incluyendo la administración de menús, usuarios, seguimiento de pedidos, y acceso a informes de ventas.

---

**Nota:** Este README es inicial. Se puede expandir cada sección con más detalles, instrucciones de instalación, cómo ejecutar las pruebas, cómo contribuir, y cualquier otra información relevante para el proyecto.