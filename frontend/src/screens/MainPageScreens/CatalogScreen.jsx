import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { AlertTriangle, Eye, Hand, List, Loader2, Scissors } from "lucide-react"
import ServiceCard from "../../components/CatalogComponents/ServiceCard.jsx"
import CategoryIcon from "../../components/CatalogComponents/CategoryIcon"
import SearchBar from "../../components/CatalogComponents/SearchBar"
import EmptyState from "../../components/CatalogComponents/EmptyState"
import CategoryHeader from "../../components/CatalogComponents/CategoryHeader"
import PromoSection from "../../components/CatalogComponents/PromoSection"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "../../../firebaseConfig.js"

const categoryConfig = {
    hair: { key: "hair", label: "Cabello", icon: Scissors },
    nails: { key: "nails", label: "Uñas", icon: Hand },
    face: { key: "face", label: "Cara", icon: Eye },
}
const allCategoryOptions = [
    { key: "todos", label: "Todos", icon: List },
    ...Object.values(categoryConfig),
]

/**
 * Main element for the Catalog screen.
 * Fetches and displays active services from Firestore.
 */
function CatalogScreen() {
    const location = useLocation()
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCategoryLabel, setSelectedCategoryLabel] = useState("Todos")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchActiveServices = async () => {
            setLoading(true)
            setError(null)
            setServices([])

            try {
                const servicesCollectionRef = collection(db, "services")
                let q
                const baseQueryConstraints = [
                    where("isActive", "==", true),
                    orderBy("name", "asc"),
                ]

                if (selectedCategoryLabel === "Todos") {
                    q = query(servicesCollectionRef, ...baseQueryConstraints)
                } else {
                    q = query(
                        servicesCollectionRef,
                        where("category", "==", selectedCategoryLabel),
                        ...baseQueryConstraints,
                    )
                }

                const querySnapshot = await getDocs(q)
                const servicesData = querySnapshot.docs.map((doc) => ({
                    serviceID: doc.id,
                    ...doc.data(),
                }))
                setServices(servicesData)
            } catch (err) {
                console.error("Error fetching active services:", err)
                setError(
                    "Error al cargar los servicios. Por favor, inténtalo de nuevo.",
                )
            } finally {
                setLoading(false)
            }
        }
        fetchActiveServices().then((r) => r)
    }, [selectedCategoryLabel])

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const categoriaKey = params.get("categoria")
        const targetCategory = Object.values(categoryConfig).find(
            (cat) => cat.key === categoriaKey,
        )

        if (targetCategory) {
            setSelectedCategoryLabel(targetCategory.label)
        } else {
            setSelectedCategoryLabel("Todos")
        }
    }, [location.search])

    const filteredServices = services.filter(
        (service) =>
            service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()),
    )

    return (
        <section className="pt-20 pb-20 px-6 sm:px-8 lg:px-16 bg-primaryLight min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Catalog Header */}
                <div id="catalog-services" className="text-center mb-12 pt-6">
                    <h1 className="text-h2 font-heading font-bold text-textMain mb-6">
                        Nuestro catálogo
                    </h1>

                    {/* Category Icons */}
                    <div className="flex justify-center gap-6 md:gap-10 flex-wrap mb-8">
                        {allCategoryOptions.map((catOption) => (
                            <CategoryIcon
                                key={catOption.key}
                                label={catOption.label}
                                icon={catOption.icon}
                                active={
                                    selectedCategoryLabel === catOption.label
                                }
                                onClick={() =>
                                    setSelectedCategoryLabel(catOption.label)
                                }
                            />
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8 max-w-xl mx-auto">
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            placeholder="Buscar servicios..."
                        />
                    </div>
                </div>

                {/* Dynamic Category Header */}
                <CategoryHeader
                    title={
                        selectedCategoryLabel === "Todos"
                            ? "Todos los servicios"
                            : selectedCategoryLabel
                    }
                />

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center p-10 text-center">
                        <Loader2 className="w-8 h-8 text-secondary animate-spin mr-3" />
                        <span className="text-gray-600">
                            Cargando servicios...
                        </span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Service List or Empty State */}
                {!loading &&
                    !error &&
                    (filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredServices.map((service) => (
                                <ServiceCard
                                    key={service.serviceID}
                                    title={service.name}
                                    description={service.description}
                                    price={service.basePrice}
                                    duration={`${service.duration} min`}
                                    imageUrl={service.imageUrl}
                                />
                            ))}
                        </div>
                    ) : (
                        // Pass the actual search query to EmptyState
                        <EmptyState
                            category={selectedCategoryLabel}
                            searchQuery={searchQuery}
                        />
                    ))}

                {/* Promotional Section */}
                {!loading && (
                    <div className="mt-16">
                        <PromoSection />
                    </div>
                )}
            </div>
        </section>
    )
}

export default CatalogScreen
