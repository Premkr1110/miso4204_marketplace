 
package co.edu.uniandes.csw.miso4204.shoppingcart.master.persistence;

import co.edu.uniandes.csw.miso4204.security.logic.dto.UserDTO;
import co.edu.uniandes.csw.miso4204.shoppingcart.logic.dto.ShoppingCartDTO;
import co.edu.uniandes.csw.miso4204.shoppingcart.master.logic.dto.ShoppingCartMasterDTO;
import co.edu.uniandes.csw.miso4204.shoppingcart.master.persistence.entity.ShoppingCartshoppingCartItemEntity;
import co.edu.uniandes.csw.miso4204.shoppingcart.persistence.ShoppingCartPersistence;
import co.edu.uniandes.csw.miso4204.shoppingcartitem.logic.dto.ShoppingCartItemDTO;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import org.apache.shiro.SecurityUtils;

public class ShoppingCartMasterPersistence extends _ShoppingCartMasterPersistence{

	private EntityManagerFactory emf;
	
    public ShoppingCartMasterPersistence() {
		emf = Persistence.createEntityManagerFactory("ShoppingCartPU");
		shoppingcartPersistence = new ShoppingCartPersistence();
    }
	
	public void getEntityManager() {
        UserDTO userSession = (UserDTO) SecurityUtils.getSubject().getPrincipal();
        String tenant = userSession.getTenantID();
        Map<String, Object> emProperties = new HashMap<String, Object>();
        emProperties.put("eclipselink.tenant-id", tenant);//Asigna un valor al multitenant
        entityManager = emf.createEntityManager(emProperties);
    }
	
	@Override
	public ShoppingCartshoppingCartItemEntity createShoppingCartshoppingCartItemEntity(ShoppingCartshoppingCartItemEntity entity) {
        ShoppingCartshoppingCartItemEntity shoppingcart;
        try{
            getEntityManager();
            shoppingcart = super.createShoppingCartshoppingCartItemEntity(entity);
        }
        catch (Exception e){
            e.printStackTrace();
            shoppingcart = null;
        }
        finally{
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }
        return shoppingcart;
    }
	@Override
	public List<ShoppingCartItemDTO> getShoppingCartshoppingCartItemEntityList(Long shoppingCartId) {
		List<ShoppingCartItemDTO> shoppingcart;
        try{
            getEntityManager();
            shoppingcart = super.getShoppingCartshoppingCartItemEntityList(shoppingCartId);
        }
        catch (Exception e){
            e.printStackTrace();
            shoppingcart = null;
        }
        finally{
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }
        return shoppingcart;
    }
	
	@Override
	public ShoppingCartMasterDTO getShoppingCart(Long shoppingcartId){
		ShoppingCartMasterDTO shoppingcart;
        try{
            getEntityManager();
            shoppingcart = super.getShoppingCart(shoppingcartId);
        }
        catch (Exception e){
            e.printStackTrace();
            shoppingcart = null;
        }
        finally{
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }
        return shoppingcart;
	}
	
	@Override
	public void deleteShoppingCartshoppingCartItemEntity(Long shoppingCartId, Long shoppingCartItemId){
		try{
            getEntityManager();
            super.deleteShoppingCartshoppingCartItemEntity(shoppingCartId,shoppingCartItemId);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        finally{
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }
	}
	
	public ShoppingCartMasterDTO getShoppingCartByCurrentUser(){
		ShoppingCartDTO sc = shoppingcartPersistence.getShoppingCartByCurrentUser();
		if (sc != null) {
			System.out.println(sc.getId());
			return getShoppingCart(sc.getId());
		}
		return null;
	}
}